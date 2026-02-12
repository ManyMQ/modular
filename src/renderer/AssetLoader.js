/**
 * AssetLoader - Handles async asset loading with caching
 * @module AssetLoader
 */

'use strict';

const { loadImage } = require('@napi-rs/canvas');

/**
 * AssetLoader - Manages image asset loading with caching and deduplication
 */
class AssetLoader {
  /**
   * @param {LRUCache} cache - Cache instance for storing loaded assets
   */
  constructor(cache) {
    this.cache = cache;
    this.loadingPromises = new Map();
    this.errors = new Map();
  }

  /**
   * Load an image asset
   * @param {string} url - Image URL or file path
   * @returns {Promise<Image>} - Loaded image
   * @throws {Error} If image loading fails
   */
  async loadImage(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid image URL');
    }

    // Check cache first
    const cacheKey = `img:${url}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // Check if already loading (deduplication)
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Check if previously failed
    if (this.errors.has(url)) {
      throw this.errors.get(url);
    }

    // Start loading
    const promise = this._loadImageInternal(url);
    this.loadingPromises.set(url, promise);

    try {
      const image = await promise;
      this.cache.set(cacheKey, image);
      this.errors.delete(url);
      return image;
    } catch (err) {
      this.errors.set(url, err);
      throw err;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  /**
   * Internal image loading
   * @private
   * @param {string} url - Image URL
   * @returns {Promise<Image>}
   */
  async _loadImageInternal(url) {
    try {
      return await loadImage(url);
    } catch (err) {
      throw new Error(`Failed to load image: ${url} - ${err.message}`);
    }
  }

  /**
   * Load multiple images in parallel
   * @param {string[]} urls - Array of image URLs
   * @param {Object} [options]
   * @param {boolean} [options.throwOnError=false] - Throw on first error
   * @returns {Promise<Map<string, Image>>} - Map of loaded images
   */
  async loadImages(urls, options = {}) {
    const { throwOnError = false } = options;
    const results = new Map();
    const errors = [];

    await Promise.all(
      urls.map(async (url) => {
        try {
          const image = await this.loadImage(url);
          results.set(url, image);
        } catch (err) {
          if (throwOnError) {
            throw err;
          }
          errors.push({ url, error: err });
        }
      })
    );

    return { results, errors };
  }

  /**
   * Generic asset load method
   * @param {string|Object} asset - Asset descriptor or URL string
   * @returns {Promise<any>} - Loaded asset
   */
  async load(asset) {
    if (typeof asset === 'string') {
      return this.loadImage(asset);
    }

    if (asset && typeof asset === 'object') {
      if (asset.type === 'image' && asset.src) {
        return this.loadImage(asset.src);
      }
      throw new Error(`Unknown asset type: ${asset.type}`);
    }

    throw new Error('Asset must be a string or object');
  }

  /**
   * Preload assets from layout tree
   * @param {Object} layout - Layout tree
   * @returns {Promise<void>}
   */
  async preloadFromLayout(layout) {
    const urls = this.extractImageUrls(layout);
    await this.loadImages(urls);
  }

  /**
   * Extract image URLs from layout tree
   * @param {Object} node - Layout node
   * @param {Set<string>} [urls] - URL collection
   * @returns {string[]} - Array of URLs
   */
  extractImageUrls(node, urls = new Set()) {
    if (!node) return Array.from(urls);

    // Check node props for image URLs
    if (node.props) {
      if (node.props.src) urls.add(node.props.src);
      if (node.props.avatar) urls.add(node.props.avatar);
      if (node.props.image) urls.add(node.props.image);
    }

    // Recurse into children
    if (node.children) {
      for (const child of node.children) {
        this.extractImageUrls(child, urls);
      }
    }

    return Array.from(urls);
  }

  /**
   * Clear error cache for a specific URL
   * @param {string} url - Image URL
   */
  clearError(url) {
    this.errors.delete(url);
  }

  /**
   * Clear all cached errors
   */
  clearErrors() {
    this.errors.clear();
  }
}

module.exports = { AssetLoader };
