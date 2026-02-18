/**
 * LRUCache - Least Recently Used cache implementation
 */
class LRUCache {
  /**
   * @param {Object} options - Cache options
   * @param {number} [options.maxSize=100] - Maximum number of items
   * @param {number} [options.ttl] - Time-to-live in milliseconds
   */
  constructor(options = {}) {
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl;
    this.cache = new Map();
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {any|undefined}
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return undefined;

    // Check TTL
    if (this.ttl && Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Update access order (LRU)
    this.cache.delete(key);
    this.cache.set(key, { ...item, timestamp: Date.now() });

    return item.value;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   */
  set(key, value) {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Remove existing to update order
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all items
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns {number}
   */
  get size() {
    return this.cache.size;
  }

  /**
   * Get all keys
   * @returns {string[]}
   */
  keys() {
    return Array.from(this.cache.keys());
  }
}

module.exports = { LRUCache };
