/**
 * ThemeManager - Manages theme registration and activation
 * @module ThemeManager
 */

'use strict';

/**
 * ThemeManager - Manages theme registration, activation, and inheritance
 */
class ThemeManager {
  constructor() {
    this.themes = new Map();
    this.activeTheme = 'default';

    // Register default theme
    this.register('default', this._createDefaultTheme());
  }

  /**
   * Create the default theme definition
   * @private
   * @returns {Object} Default theme object
   */
  _createDefaultTheme() {
    return {
      name: 'default',
      colors: {
        surface: {
          primary: '#0a0a0f',
          secondary: '#16161e',
          tertiary: '#1a1a23',
          elevated: '#050508'
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          muted: '#6b7280'
        },
        accent: {
          primary: '#7c3aed',
          secondary: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.4)'
        },
        border: {
          default: 'rgba(255, 255, 255, 0.1)',
          highlight: 'rgba(255, 255, 255, 0.2)'
        },
        status: {
          online: '#22c55e',
          idle: '#f59e0b',
          dnd: '#ef4444',
          offline: '#6b7280',
          streaming: '#a855f7'
        }
      },
      fonts: {
        family: 'Inter, Poppins, sans-serif',
        sizes: {
          xs: 10,
          sm: 12,
          main: 'Inter, sans-serif',
          bold: 'Inter Bold, sans-serif'
        }
      }
    };
  }

  /**
   * Register a new theme
   * @param {string} name - Unique theme identifier
   * @param {Object} theme - Theme configuration object
   * @param {string} [base] - Base theme name to extend from
   * @returns {ThemeManager} This manager instance for method chaining
   * @throws {Error} If name or theme is missing
   */
  register(name, theme, base = null) {
    if (!name || !theme) {
      throw new Error('Theme name and definition are required');
    }

    let finalTheme = theme;
    if (base && this.themes.has(base)) {
      finalTheme = this.extend(base, name, theme);
    }

    this.themes.set(name, finalTheme);
    return this;
  }

  /**
   * Set the active global theme
   * @param {string} name - Theme identifier
   * @returns {ThemeManager} This manager instance for method chaining
   * @throws {Error} If theme name is not registered
   */
  setActive(name) {
    if (!this.themes.has(name)) {
      throw new Error(`Theme "${name}" not found`);
    }
    this.activeTheme = name;
    return this;
  }

  /**
   * Get theme definition by name
   * @param {string} name - Theme identifier
   * @returns {Object|null} Theme definition or null if not found
   */
  get(name) {
    if (this.themes.has(name)) {
      return this.themes.get(name);
    }
    // Silent fallback to 'default'
    return this.themes.get('default');
  }

  /**
   * Get the currently active theme definition
   * @returns {Object} Active theme definition
   */
  getActive() {
    return this.get(this.activeTheme);
  }

  /**
   * Extend an existing theme to create a new one
   * @param {string} baseName - Name of theme to extend
   * @param {string} newName - Name for the new theme
   * @param {Object} overrides - Overriding properties
   * @returns {Object} The new extended theme definition
   */
  extend(baseName, newName, overrides) {
    const base = this.get(baseName);
    if (!base) throw new Error(`Base theme "${baseName}" not found`);

    const extended = this._deepMerge(base, overrides);
    this.themes.set(newName, extended);
    return extended;
  }

  /**
   * Get a token value from a theme by path
   * @param {string} name - Theme identifier
   * @param {string} path - Dot-separated path (e.g., 'colors.accent.primary')
   * @param {*} [fallback] - Fallback value if not found
   * @returns {*} Token value or fallback
   */
  getToken(name, path, fallback) {
    const theme = this.get(name);
    if (!theme) return fallback;

    const keys = path.split('.');
    let current = theme;

    for (const key of keys) {
      if (current == null) return fallback;
      current = current[key];
    }

    return current !== undefined ? current : fallback;
  }

  /**
   * Deep merge objects helper
   * @private
   * @param {Object} target - The target object to merge into
   * @param {Object} source - The source object to merge from
   * @returns {Object} The merged object
   */
  _deepMerge(target, source) {
    const output = { ...target };
    if (this._isObject(target) && this._isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this._isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this._deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  /**
   * Check if value is an object helper
   * @private
   * @param {*} item - The item to check
   * @returns {boolean} True if the item is an object, false otherwise
   */
  _isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
}

module.exports = { ThemeManager };
