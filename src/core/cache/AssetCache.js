/**
 * AssetCache - Specialized cache for image and font assets
 */
class AssetCache {
  /**
   * @param {LRUCache} lruCache - LRU cache instance
   */
  constructor(lruCache) {
    this.cache = lruCache;
  }

  /**
   * Get image from cache
   * @param {string} url - Image URL
   * @returns {Image|undefined}
   */
  getImage(url) {
    return this.cache.get(`img:${url}`);
  }

  /**
   * Store image in cache
   * @param {string} url - Image URL
   * @param {Image} image - Image object
   */
  setImage(url, image) {
    this.cache.set(`img:${url}`, image);
  }

  /**
   * Get gradient from cache
   * @param {string} key - Gradient key
   * @returns {CanvasGradient|undefined}
   */
  getGradient(key) {
    return this.cache.get(`grad:${key}`);
  }

  /**
   * Store gradient in cache
   * @param {string} key - Gradient key
   * @param {CanvasGradient} gradient - Gradient object
   */
  setGradient(key, gradient) {
    this.cache.set(`grad:${key}`, gradient);
  }

  /**
   * Get font metrics from cache
   * @param {string} key - Font key
   * @returns {Object|undefined}
   */
  getFontMetrics(key) {
    return this.cache.get(`font:${key}`);
  }

  /**
   * Store font metrics in cache
   * @param {string} key - Font key
   * @param {Object} metrics - Font metrics
   */
  setFontMetrics(key, metrics) {
    this.cache.set(`font:${key}`, metrics);
  }

  /**
   * Clear all assets
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   * @returns {Object}
   */
  getStats() {
    const keys = this.cache.keys();
    const stats = {
      images: 0,
      gradients: 0,
      fonts: 0,
      total: keys.length
    };

    for (const key of keys) {
      if (key.startsWith('img:')) stats.images++;
      else if (key.startsWith('grad:')) stats.gradients++;
      else if (key.startsWith('font:')) stats.fonts++;
    }

    return stats;
  }
}

module.exports = { AssetCache };
