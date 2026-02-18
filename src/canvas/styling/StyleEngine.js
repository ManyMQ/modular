/**
 * StyleEngine - Computes and applies styles to components
 */
class StyleEngine {
  /**
   * @param {TokenEngine} tokenEngine - Token engine instance
   */
  constructor(tokenEngine) {
    this.tokenEngine = tokenEngine;
  }

  /**
   * Compute styles for a layout tree
   * @param {Object} layout - Resolved layout tree
   * @param {Object} theme - Active theme
   * @param {Object} tokens - Resolved tokens
   * @returns {Object} - Computed styles
   */
  compute(layout, theme, tokens) {
    const styles = {
      background: {},
      typography: {},
      spacing: {},
      effects: {},
      components: {}
    };

    // Apply theme base
    if (theme) {
      Object.assign(styles, this._extractThemeStyles(theme));
    }

    // Apply tokens
    Object.assign(styles, this._extractTokenStyles(tokens));

    // Process layout-specific styles
    styles.components = this._computeComponentStyles(layout);

    return styles;
  }

  /**
   * Extract styles from theme
   * @private
   */
  _extractThemeStyles(theme) {
    return {
      background: {
        color: theme.colors?.surface?.primary || '#0a0a0f',
        card: theme.colors?.surface?.secondary || '#16161e',
        secondary: theme.colors?.surface?.tertiary || '#1f1f2e'
      },
      typography: {
        primary: theme.colors?.text?.primary || '#ffffff',
        secondary: theme.colors?.text?.secondary || '#9ca3af',
        muted: theme.colors?.text?.muted || '#6b7280',
        fontFamily: theme.fonts?.family || 'Inter, sans-serif'
      },
      spacing: {
        unit: 4,
        xs: theme.spacing?.xs || 4,
        sm: theme.spacing?.sm || 8,
        md: theme.spacing?.md || 12,
        lg: theme.spacing?.lg || 16,
        xl: theme.spacing?.xl || 24
      },
      effects: {
        borderRadius: theme.radius?.card || 12,
        glowStrength: theme.effects?.glowStrength || 15,
        shadowBlur: theme.effects?.shadowBlur || 20
      }
    };
  }

  /**
   * Extract styles from tokens
   * @private
   */
  _extractTokenStyles(tokens) {
    return {
      accent: {
        primary: tokens.accentColor || '#7c3aed',
        secondary: tokens.accentSecondary || '#8b5cf6',
        glow: tokens.glowColor || 'rgba(139, 92, 246, 0.4)'
      },
      custom: tokens
    };
  }

  /**
   * Compute component-specific styles
   * @private
   */
  _computeComponentStyles(layout) {
    const components = {};

    this._walkTree(layout, (node) => {
      if (node.type && node.style) {
        components[node.type] = {
          ...components[node.type],
          ...node.style
        };
      }
    });

    return components;
  }

  /**
   * Walk layout tree
   * @private
   */
  _walkTree(node, callback) {
    if (!node) return;

    callback(node);

    if (node.children) {
      for (const child of node.children) {
        this._walkTree(child, callback);
      }
    }
  }

  /**
   * Resolve a style value
   * @param {string} value - Style value (can be token reference)
   * @param {Object} styles - Computed styles
   * @returns {any} - Resolved value
   */
  resolveValue(value, styles) {
    if (typeof value !== 'string') return value;

    // Check if it's a token reference: {token.name}
    const match = value.match(/^\{(.+)\}$/);
    if (match) {
      const tokenPath = match[1];
      return this._getPath(styles, tokenPath);
    }

    return value;
  }

  /**
   * Get value by path
   * @private
   */
  _getPath(obj, path) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current == null) return undefined;
      current = current[key];
    }

    return current;
  }

  /**
   * Merge styles
   * @param {...Object} styleObjects - Style objects to merge
   * @returns {Object} - Merged styles
   */
  merge(...styleObjects) {
    return styleObjects.reduce((acc, styles) => {
      if (!styles) return acc;

      for (const [key, value] of Object.entries(styles)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          acc[key] = this.merge(acc[key] || {}, value);
        } else {
          acc[key] = value;
        }
      }

      return acc;
    }, {});
  }
}

module.exports = { StyleEngine };
