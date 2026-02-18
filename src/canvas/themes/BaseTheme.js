/**
 * BaseTheme - Base class for creating custom themes
 */
class BaseTheme {
  /**
   * @param {Object} definition - Theme definition object
   */
  constructor(definition) {
    this.definition = definition;
  }

  /**
   * Get theme colors
   * @returns {Object}
   */
  getColors() {
    return this.definition.colors || {};
  }

  /**
   * Get theme fonts
   * @returns {Object}
   */
  getFonts() {
    return this.definition.fonts || {};
  }

  /**
   * Get theme spacing
   * @returns {Object}
   */
  getSpacing() {
    return this.definition.spacing || {};
  }

  /**
   * Get theme effects
   * @returns {Object}
   */
  getEffects() {
    return this.definition.effects || {};
  }

  /**
   * Get a color value by path
   * @param {string} path - Dot-notation path (e.g., 'background.primary')
   * @param {string} fallback - Fallback value
   * @returns {string}
   */
  getColor(path, fallback = '#000000') {
    const keys = path.split('.');
    let current = this.definition.colors;

    for (const key of keys) {
      if (current == null) return fallback;
      current = current[key];
    }

    return current || fallback;
  }

  /**
   * Get a font size
   * @param {string} size - Size key (xs, sm, md, lg, xl, xxl)
   * @param {number} fallback - Fallback value
   * @returns {number}
   */
  getFontSize(size, fallback = 14) {
    return this.definition.fonts?.sizes?.[size] || fallback;
  }

  /**
   * Get spacing value by key
   * @param {string} size - Size key
   * @param {number} fallback - Fallback value
   * @returns {number}
   */
  getSpacingValue(size, fallback = 4) {
    return this.definition.spacing?.[size] || fallback;
  }

  /**
   * Export theme definition
   * @returns {Object}
   */
  export() {
    return this.definition;
  }

  /**
   * Clone this theme
   * @returns {BaseTheme}
   */
  clone() {
    return new BaseTheme(JSON.parse(JSON.stringify(this.definition)));
  }

  /**
   * Merge with another theme
   * @param {Object|BaseTheme} other - Theme to merge
   * @returns {BaseTheme} - New merged theme
   */
  merge(other) {
    const otherDef = other instanceof BaseTheme ? other.export() : other;
    const merged = this._deepMerge(this.definition, otherDef);
    return new BaseTheme(merged);
  }

  /**
   * Deep merge objects
   * @private
   */
  _deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}

module.exports = { BaseTheme };
