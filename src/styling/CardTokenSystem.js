/**
 * CardTokenSystem - Token mapping and resolution for card rendering
 * Maps visual design properties to engine token system
 */

const { TokenEngine } = require('../styling/TokenEngine');
const { cardThemes, themeToTokens, cardDimensions } = require('../themes/CardThemes');

class CardTokenSystem {
  constructor(themeName = 'discord', cardType = 'rank') {
    this.themeName = themeName;
    this.cardType = cardType;
    this.tokenEngine = new TokenEngine();
    this.dimensions = cardDimensions[cardType] || cardDimensions.rank;
    
    // Initialize tokens from theme
    this._initializeTokens();
  }

  _initializeTokens() {
    const tokens = themeToTokens(this.themeName);
    
    // Register all tokens
    Object.entries(tokens).forEach(([key, value]) => {
      this.tokenEngine.define(key, value);
    });
    
    // Register computed tokens
    this._registerComputedTokens();
  }

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
  }

  /**
   * Get token value
   */
  get(key, context = {}) {
    return this.tokenEngine.get(key, context);
  }

  /**
   * Get multiple tokens as object
   */
  getMany(keys, context = {}) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.get(key, context);
    });
    return result;
  }

  /**
   * Get all card layout tokens
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
   * Get all color tokens
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
   * Get all effect tokens
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
   * Get card dimensions
   */
  getDimensions() {
    return { ...this.dimensions };
  }

  /**
   * Update theme
   */
  setTheme(themeName) {
    this.themeName = themeName;
    this.tokenEngine.clear();
    this._initializeTokens();
  }

  /**
   * Override specific token
   */
  setToken(key, value) {
    this.tokenEngine.define(key, value);
  }

  /**
   * Override multiple tokens
   */
  setTokens(tokens) {
    Object.entries(tokens).forEach(([key, value]) => {
      this.tokenEngine.define(key, value);
    });
  }

  /**
   * Get theme name
   */
  getThemeName() {
    return this.themeName;
  }

  /**
   * Get card type
   */
  getCardType() {
    return this.cardType;
  }

  /**
   * Export all tokens as flat object
   */
  export() {
    return this.tokenEngine.keys().reduce((acc, key) => {
      acc[key] = this.tokenEngine.get(key);
      return acc;
    }, {});
  }

  /**
   * Clone token system with overrides
   */
  clone(overrides = {}) {
    const cloned = new CardTokenSystem(this.themeName, this.cardType);
    cloned.setTokens(overrides);
    return cloned;
  }

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
