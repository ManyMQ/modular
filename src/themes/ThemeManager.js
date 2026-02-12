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
   * @returns {Object}
   */
  _createDefaultTheme() {
    return {
      name: 'default',
      colors: {
        background: {
          primary: '#0a0a0f',
          secondary: '#16161e',
          card: '#1a1a23'
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
        primary: 'Inter',
        secondary: 'Poppins',
        mono: 'JetBrains Mono',
        sizes: {
          xs: 10,
          sm: 12,
          md: 14,
          lg: 16,
          xl: 20,
          xxl: 24,
          xxxl: 32
        }
      },
      spacing: {
        unit: 4,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
        xxxl: 48
      },
      effects: {
        glowStrength: 15,
        borderRadius: 12,
        shadowBlur: 20,
        borderWidth: 1
      },
      animations: {
        duration: 300,
        easing: 'ease-out'
      }
    };
  }

  /**
   * Register a theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme definition
   * @param {string} [base] - Base theme to extend
   * @throws {Error} If theme name is invalid
   */
  register(name, theme, base = null) {
    if (!name || typeof name !== 'string') {
      throw new Error('Theme name must be a non-empty string');
    }

    if (theme && typeof theme === 'object') {
      if (base && this.themes.has(base)) {
        const baseTheme = this.themes.get(base);
        theme = this._merge(baseTheme, theme);
      }
      // Ensure theme has a name
      theme.name = name;
    }

    this.themes.set(name, theme);
  }

  /**
   * Get a theme
   * @param {string} name - Theme name
   * @returns {Object|undefined}
   */
  get(name) {
    return this.themes.get(name) || this.themes.get('default');
  }

  /**
   * Get active theme
   * @returns {Object}
   */
  getActive() {
    return this.get(this.activeTheme);
  }

  /**
   * Set active theme
   * @param {string} name - Theme name
   * @returns {boolean} - Whether theme was set successfully
   */
  setActive(name) {
    if (this.themes.has(name)) {
      this.activeTheme = name;
      return true;
    }
    // Silently fall back to default for production stability
    this.activeTheme = 'default';
    return false;
  }

  /**
   * Check if theme exists
   * @param {string} name - Theme name
   * @returns {boolean}
   */
  has(name) {
    return this.themes.has(name);
  }

  /**
   * List all registered themes
   * @returns {string[]}
   */
  list() {
    return Array.from(this.themes.keys());
  }

  /**
   * Create a theme from base with overrides
   * @param {string} baseName - Base theme name
   * @param {string} newName - New theme name
   * @param {Object} overrides - Theme overrides
   * @returns {Object} - The new theme
   */
  extend(baseName, newName, overrides) {
    const base = this.get(baseName);
    if (!base) {
      throw new Error(`Base theme '${baseName}' not found`);
    }
    const extended = this._merge(base, overrides);
    this.register(newName, extended);
    return extended;
  }

  /**
   * Merge themes
   * @private
   * @param {Object} base
   * @param {Object} override
   * @returns {Object}
   */
  _merge(base, override) {
    if (!base) return override || {};
    if (!override) return base;
    
    const result = { ...base };

    for (const key in override) {
      if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
        result[key] = this._merge(base[key] || {}, override[key]);
      } else {
        result[key] = override[key];
      }
    }

    return result;
  }

  /**
   * Get theme token value
   * @param {string} name - Theme name
   * @param {string} path - Dot-separated path (e.g., 'colors.accent.primary')
   * @param {*} [fallback] - Fallback value
   * @returns {*}
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
}

/**
 * BaseTheme - Base class for creating custom themes
 */
class BaseTheme {
  /**
   * @param {Object} definition - Theme definition
   */
  constructor(definition) {
    this.definition = definition || {};
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
   * Get specific color
   * @param {string} path - Color path
   * @param {*} [fallback]
   * @returns {*}
   */
  getColor(path, fallback) {
    const colors = this.getColors();
    const keys = path.split('.');
    let current = colors;
    
    for (const key of keys) {
      if (current == null) return fallback;
      current = current[key];
    }
    
    return current !== undefined ? current : fallback;
  }

  /**
   * Export theme definition
   * @returns {Object}
   */
  export() {
    return { ...this.definition };
  }
}

// Predefined themes
const cyberpunkTheme = {
  name: 'cyberpunk',
  colors: {
    background: {
      primary: '#0a0a0f',
      secondary: '#0d0d12',
      card: '#0f0f1a'
    },
    accent: {
      primary: '#00f0ff',
      secondary: '#ff00ff',
      glow: 'rgba(0, 240, 255, 0.5)'
    }
  },
  effects: {
    glowStrength: 25,
    borderRadius: 8,
    shadowBlur: 30
  }
};

const neonTheme = {
  name: 'neon',
  colors: {
    accent: {
      primary: '#d946ef',
      secondary: '#f0abfc',
      glow: 'rgba(217, 70, 239, 0.5)'
    }
  },
  effects: {
    glowStrength: 20,
    borderRadius: 16,
    shadowBlur: 25
  }
};

const darkTheme = {
  name: 'dark',
  colors: {
    background: {
      primary: '#0a0a0f',
      secondary: '#13131a',
      card: '#16161e'
    }
  }
};

const midnightTheme = {
  name: 'midnight',
  colors: {
    background: {
      primary: '#020617',
      secondary: '#0f172a',
      card: '#1e293b'
    },
    accent: {
      primary: '#6366f1',
      secondary: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.4)'
    }
  }
};

module.exports = {
  ThemeManager,
  BaseTheme,
  cyberpunkTheme,
  neonTheme,
  darkTheme,
  midnightTheme
};
