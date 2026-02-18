/**
 * CardTokenSystem - Token mapping and resolution for card rendering
 * Maps visual design properties to engine token system
 * @module CardTokenSystem
 */

const { TokenEngine } = require('./TokenEngine');
const { cardThemes, themeToTokens, cardDimensions } = require('../themes/index');

/**
 * CardTokenSystem - Manages design tokens and their application to components
 */
class CardTokenSystem {
  /**
   * @param {string} [themeName='discord'] - Name of the theme to load
   * @param {string} [cardType='rank'] - Type of card (rank, music, etc.)
   */
  constructor(themeName = 'discord', cardType = 'rank') {
    this.themeName = themeName;
    this.cardType = cardType;
    this.tokenEngine = new TokenEngine();
    this.dimensions = cardDimensions[cardType] || cardDimensions.rank;

    // Initialize tokens from theme
    this._initializeTokens();
  }

  /**
   * Initialize tokens from the theme definition
   * @private
   */
  _initializeTokens() {
    let tokens = {};
    try {
      tokens = themeToTokens(this.themeName) || {};
    } catch {
      // Fallback: empty token set
      tokens = {};
    }

    // Register all tokens
    Object.entries(tokens).forEach(([key, value]) => {
      this.tokenEngine.define(key, value);
    });

    // Register computed tokens
    this._registerComputedTokens();
  }

  /**
   * Register computed design tokens
   * @private
   */
  _registerComputedTokens() {
    // Computed: Avatar size based on card type
    this.tokenEngine.defineComputed('component.avatar.size', (ctx, tokens) => {
      const sizes = {
        rank: 80,
        music: 100,
        leaderboard: 36,
        invite: 70
      };
      return sizes[this.cardType] || 80;
    });

    // Computed: Header height based on content
    this.tokenEngine.defineComputed('layout.header.height', (ctx, tokens) => {
      const heights = {
        rank: 120,
        music: 140,
        leaderboard: 60,
        invite: 100
      };
      return heights[this.cardType] || 100;
    });

    // Computed: Progress bar color with glow
    this.tokenEngine.defineComputed('progress.glow.color', (ctx, tokens) => {
      const accent = tokens.get('accent.primary');
      return this._setAlpha(accent, 0.5);
    });

    // Computed: Card background with variant
    this.tokenEngine.defineComputed('card.background', (ctx, tokens) => {
      const variant = ctx?.variant || 'default';
      const surface = tokens.get('surface.primary');

      if (variant === 'elevated') {
        return tokens.get('surface.elevated');
      }
      if (variant === 'secondary') {
        return tokens.get('surface.secondary');
      }
      return surface;
    });

    // Computed: Text color based on hierarchy
    this.tokenEngine.defineComputed('text.hierarchy', (ctx, tokens) => {
      const level = ctx?.level || 'primary';
      return tokens.get(`text.${level}`);
    });

    // Computed: Spacing scale
    this.tokenEngine.defineComputed('spacing.scale', (ctx, tokens) => {
      const scale = ctx?.scale || 1;
      const base = tokens.get('spacing.md');
      return base * scale;
    });

    // Computed: Border radius based on component
    this.tokenEngine.defineComputed('radius.component', (ctx, tokens) => {
      const component = ctx?.component || 'card';
      return tokens.get(`radius.${component}`);
    });

    // Computed: Shadow based on elevation
    this.tokenEngine.defineComputed('shadow.elevation', (ctx, tokens) => {
      const elevation = ctx?.elevation || 'card';
      return tokens.get(`shadow.${elevation}`);
    });

    // Computed: Glow effect strength based on theme
    this.tokenEngine.defineComputed('effect.glow.active', (ctx, tokens) => {
      const strength = tokens.get('glow.strength');
      return strength > 15;
    });

    // Computed: Font stack with fallbacks
    this.tokenEngine.defineComputed('font.stack', (ctx, tokens) => {
      const family = tokens.get('font.family');
      return `${family}, system-ui, -apple-system, sans-serif`;
    });

    // Computed: Status color
    this.tokenEngine.defineComputed('color.status', (ctx, tokens) => {
      const status = ctx?.status || 'online';
      return tokens.get(`status.${status}`);
    });

    // --- Rank Card Specific Tokens ---
    this.tokenEngine.defineComputed('rank.color.accent', (ctx, tokens) => tokens.get('accent.primary'));
    this.tokenEngine.defineComputed('rank.color.stats', (ctx, tokens) => tokens.get('text.primary'));
    this.tokenEngine.defineComputed('rank.color.muted', (ctx, tokens) => tokens.get('text.muted'));
    this.tokenEngine.defineComputed('rank.color.label', (ctx, tokens) => tokens.get('text.secondary'));

    this.tokenEngine.defineComputed('rank.font.size.name', (ctx, tokens) => 52);
    this.tokenEngine.defineComputed('rank.font.size.stats', (ctx, tokens) => 22);
    this.tokenEngine.defineComputed('rank.font.size.labels', (ctx, tokens) => 24);
    this.tokenEngine.defineComputed('rank.font.size.level', (ctx, tokens) => 28);
    this.tokenEngine.defineComputed('rank.font.size.badge', (ctx, tokens) => 18);

    this.tokenEngine.defineComputed('rank.radius.avatar', (ctx, tokens) => 24);
    this.tokenEngine.defineComputed('rank.radius.badge', (ctx, tokens) => 10);
    this.tokenEngine.defineComputed('rank.radius.levelBox', (ctx, tokens) => 18);
  }

  /**
   * Retrieves the value of a design token.
   * @param {string} key - The key of the token to retrieve (e.g., 'text.primary').
   * @param {object} [context={}] - An optional context object that can influence computed token values.
   * @returns {*} The resolved value of the token.
   */
  get(key, context = {}) {
    return this.tokenEngine.get(key, context);
  }

  /**
   * Retrieves multiple token values as an object.
   * @param {string[]} keys - An array of token keys to retrieve.
   * @param {object} [context={}] - An optional context object for computed tokens.
   * @returns {object} An object where keys are token names and values are their resolved values.
   */
  getMany(keys, context = {}) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.get(key, context);
    });
    return result;
  }

  /**
   * Retrieves a set of common layout-related tokens.
   * @returns {object} An object containing layout token values.
   */
  getLayoutTokens() {
    return this.getMany([
      'spacing.xs',
      'spacing.sm',
      'spacing.md',
      'spacing.lg',
      'spacing.xl',
      'radius.card',
      'radius.inner',
      'radius.pill',
      'layout.header.height'
    ]);
  }

  /**
   * Retrieves a set of common color-related tokens.
   * @returns {object} An object containing color token values.
   */
  getColorTokens() {
    return this.getMany([
      'surface.primary',
      'surface.secondary',
      'surface.tertiary',
      'accent.primary',
      'accent.secondary',
      'accent.glow',
      'text.primary',
      'text.secondary',
      'text.muted'
    ]);
  }

  /**
   * Retrieves a set of common effect-related tokens.
   * @returns {object} An object containing effect token values.
   */
  getEffectTokens() {
    return this.getMany([
      'glow.strength',
      'shadow.blur',
      'shadow.offset',
      'glass.blur',
      'border.width',
      'progress.height',
      'effect.cornerBrackets',
      'effect.scanlines',
      'effect.glassmorphism',
      'effect.holographic',
      'effect.metallic'
    ]);
  }

  /**
   * Retrieves the dimensions of the card associated with this token system.
   * @returns {object} An object containing `width` and `height` properties.
   */
  getDimensions() {
    return { ...this.dimensions };
  }

  /**
   * Updates the theme used by the token system. This clears existing tokens and re-initializes them.
   * @param {string} themeName - The name of the new theme to apply.
   */
  setTheme(themeName) {
    this.themeName = themeName;
    this.tokenEngine.clear();
    this._initializeTokens();
  }

  /**
   * Overrides or defines a specific token with a new value.
   * @param {string} key - The key of the token to set.
   * @param {*} value - The new value for the token.
   */
  setToken(key, value) {
    this.tokenEngine.define(key, value);
  }

  /**
   * Overrides or defines multiple tokens from an object.
   * @param {object} tokens - An object where keys are token names and values are their new values.
   */
  setTokens(tokens) {
    Object.entries(tokens).forEach(([key, value]) => {
      this.tokenEngine.define(key, value);
    });
  }

  /**
   * Retrieves the name of the current theme.
   * @returns {string} The name of the theme.
   */
  getThemeName() {
    return this.themeName;
  }

  /**
   * Retrieves the type of card this token system is configured for.
   * @returns {string} The card type (e.g., 'rank', 'music').
   */
  getCardType() {
    return this.cardType;
  }

  /**
   * Exports all currently defined tokens as a flat object.
   * Note: This will resolve computed tokens without context.
   * @returns {object} A flat object containing all token keys and their resolved values.
   */
  export() {
    return this.tokenEngine.keys().reduce((acc, key) => {
      acc[key] = this.tokenEngine.get(key);
      return acc;
    }, {});
  }

  /**
   * Creates a clone of the current CardTokenSystem instance, optionally applying overrides.
   * @param {object} [overrides={}] - An object of token overrides to apply to the cloned system.
   * @returns {CardTokenSystem} A new instance of CardTokenSystem with the same base configuration and applied overrides.
   */
  clone(overrides = {}) {
    const cloned = new CardTokenSystem(this.themeName, this.cardType);
    cloned.setTokens(overrides);
    return cloned;
  }

  /**
   * Set alpha channel for a color string
   * @private
   * @param {string} color - Hex or RGBA color string
   * @param {number} alpha - Alpha value (0-1)
   * @returns {string} RGBA color string
   */
  _setAlpha(color, alpha) {
    // Simple alpha setter for hex/rgba
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/, `${alpha})`);
    }
    return color;
  }

  /**
   * Create token context for card rendering
   * @param {object} [options={}] - Render options
   * @returns {object} Render context object
   */
  createRenderContext(options = {}) {
    return {
      dpi: options.dpi || 2,
      width: this.dimensions.width,
      height: this.dimensions.height,
      variant: options.variant || 'default',
      ...options
    };
  }
}

/**
 * Token presets for quick styling
 */
const tokenPresets = {
  // Minimal style - reduce glow and shadows
  minimal: {
    'glow.strength': 5,
    'shadow.blur': 10,
    'border.width': 1
  },

  // High contrast - boost everything
  highContrast: {
    'glow.strength': 40,
    'shadow.blur': 30,
    'border.width': 2,
    'progress.height': 12
  },

  // Compact - reduce spacing
  compact: {
    'spacing.xs': 2,
    'spacing.sm': 4,
    'spacing.md': 6,
    'spacing.lg': 8,
    'spacing.xl': 12
  },

  // Spacious - increase spacing
  spacious: {
    'spacing.xs': 6,
    'spacing.sm': 12,
    'spacing.md': 18,
    'spacing.lg': 24,
    'spacing.xl': 36
  },

  // No effects - flat design
  flat: {
    'glow.strength': 0,
    'shadow.blur': 0,
    'shadow.offset': 0,
    'effect.cornerBrackets': false
  },

  // Maximum glow - neon style
  neon: {
    'glow.strength': 50,
    'shadow.blur': 40,
    'effect.glow.active': true
  }
};

/**
 * Apply token preset to token system
 * @param {CardTokenSystem} tokenSystem - The system to apply to
 * @param {string} presetName - Name of the preset
 * @returns {CardTokenSystem} The modified token system
 */
function applyPreset(tokenSystem, presetName) {
  const preset = tokenPresets[presetName];
  if (preset) {
    tokenSystem.setTokens(preset);
  }
  return tokenSystem;
}

/**
 * Create token system for card
 * @param {string} themeName - Theme name
 * @param {string} cardType - Card type
 * @param {object} [options={}] - Creation options
 * @returns {CardTokenSystem} Initialized token system
 */
function createCardTokens(themeName, cardType, options = {}) {
  const system = new CardTokenSystem(themeName, cardType);

  if (options.preset) {
    applyPreset(system, options.preset);
  }

  if (options.tokens) {
    system.setTokens(options.tokens);
  }

  return system;
}

module.exports = {
  CardTokenSystem,
  tokenPresets,
  applyPreset,
  createCardTokens
};

