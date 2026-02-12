/**
 * TokenEngine - Manages design tokens for consistent theming
 */
class TokenEngine {
  constructor() {
    this.tokens = new Map();
    this.computed = new Map();
  }

  /**
   * Define a static token
   * @param {string} name - Token name
   * @param {any} value - Token value
   */
  define(name, value) {
    this.tokens.set(name, value);
    this.computed.delete(name);
  }

  /**
   * Define multiple tokens at once
   * @param {Object} tokens - Token definitions
   */
  defineBatch(tokens) {
    for (const [name, value] of Object.entries(tokens)) {
      this.define(name, value);
    }
  }

  /**
   * Define a computed token
   * @param {string} name - Token name
   * @param {Function} resolver - Resolver function
   */
  defineComputed(name, resolver) {
    this.computed.set(name, resolver);
  }

  /**
   * Get token value
   * @param {string} name - Token name
   * @param {Object} context - Context for computed tokens
   * @param {any} fallback - Fallback value
   * @returns {any} - Token value
   */
  get(name, context = {}, fallback = null) {
    // Check computed tokens first
    if (this.computed.has(name)) {
      const resolver = this.computed.get(name);
      return resolver(context, this);
    }

    // Check static tokens
    if (this.tokens.has(name)) {
      return this.tokens.get(name);
    }

    return fallback;
  }

  /**
   * Resolve all tokens with context
   * @param {Object} context - Context object
   * @returns {Object} - Resolved tokens
   */
  resolve(context = {}) {
    const resolved = {};

    // Copy static tokens
    for (const [name, value] of this.tokens) {
      resolved[name] = value;
    }

    // Merge with context tokens
    for (const [name, value] of Object.entries(context)) {
      resolved[name] = value;
    }

    // Resolve computed tokens
    for (const [name, resolver] of this.computed) {
      resolved[name] = resolver(resolved, this);
    }

    return resolved;
  }

  /**
   * Check if token exists
   * @param {string} name - Token name
   * @returns {boolean}
   */
  has(name) {
    return this.tokens.has(name) || this.computed.has(name);
  }

  /**
   * Delete a token
   * @param {string} name - Token name
   */
  delete(name) {
    this.tokens.delete(name);
    this.computed.delete(name);
  }

  /**
   * Clear all tokens
   */
  clear() {
    this.tokens.clear();
    this.computed.clear();
  }

  /**
   * Clone this engine
   * @returns {TokenEngine}
   */
  clone() {
    const clone = new TokenEngine();
    
    for (const [name, value] of this.tokens) {
      clone.tokens.set(name, value);
    }

    for (const [name, resolver] of this.computed) {
      clone.computed.set(name, resolver);
    }

    return clone;
  }

  /**
   * Get all token names
   * @returns {string[]}
   */
  keys() {
    const keys = new Set([
      ...this.tokens.keys(),
      ...this.computed.keys()
    ]);
    return Array.from(keys);
  }
}

module.exports = { TokenEngine };
