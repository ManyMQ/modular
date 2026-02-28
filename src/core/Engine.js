/**
 * Engine - Core rendering engine that orchestrates all subsystems
 * @module Engine
 * 
 * @example
 * const engine = createEngine();
 * 
 * // Create different card types
 * const rankCard = engine.createRankCard();
 * const musicCard = engine.createMusicCard();
 * const leaderboardCard = engine.createLeaderboardCard();
 * const inviteCard = engine.createInviteCard();
 */

'use strict';

const EventEmitter = require('events');
const { CanvasRenderer } = require('../canvas/engine/CanvasRenderer');
const { AssetLoader } = require('../canvas/engine/AssetLoader');
const { BufferManager } = require('../canvas/engine/BufferManager');
const { TextComponent } = require('../canvas/components/TextComponent');
const { AvatarComponent } = require('../canvas/components/AvatarComponent');
const { ProgressComponent } = require('../canvas/components/ProgressComponent');
const { MediaComponent } = require('../canvas/components/MediaComponent');
const { ContainerComponent } = require('../canvas/components/ContainerComponent');
const { LayoutParser } = require('../canvas/layout/LayoutParser');
const { LayoutResolver } = require('../canvas/layout/LayoutResolver');
const { StyleEngine } = require('../canvas/styling/StyleEngine');
const { TokenEngine } = require('../canvas/styling/TokenEngine');
const { ThemeManager } = require('../canvas/themes/ThemeManager');
const { PluginManager } = require('./plugins/PluginManager');
const { ComponentRegistry } = require('./ComponentRegistry');
const { LRUCache } = require('./cache/LRUCache');
const CardBuilder = require('./CardBuilder');

// Card renderers — each card type has its own focused renderer
const { RankCardRenderer } = require('../canvas/renderers/RankCardRenderer');
const { MusicCardRenderer } = require('../canvas/renderers/MusicCardRenderer');
const { LeaderboardCardRenderer } = require('../canvas/renderers/LeaderboardCardRenderer');
const { InviteCardRenderer } = require('../canvas/renderers/InviteCardRenderer');
const { ProfileCardRenderer } = require('../canvas/renderers/ProfileCardRenderer');
const { WelcomeCardRenderer } = require('../canvas/renderers/WelcomeCardRenderer');

// Builders are loaded lazily in factory methods to prevent circular dependencies

/**
 * Engine - Production-grade Node.js canvas rendering engine
 * @extends EventEmitter
 */
class Engine extends EventEmitter {
  /**
   * @param {Object} options - Engine configuration
   * @param {number} [options.dpi=2] - Canvas DPI scaling
   * @param {Object} [options.cache] - Cache configuration
   * @param {Object} [options.renderer] - Renderer configuration
   * @param {boolean} [options.debug=false] - Enable debug mode
   */
  constructor(options = {}) {
    super();

    this.options = options;
    this.config = {
      dpi: options.dpi || 2,
      debug: options.debug || false,
      ...options
    };

    // Initialize subsystems
    this.cache = new LRUCache(options.cache);
    this.assetLoader = new AssetLoader(this.cache);
    this.bufferManager = new BufferManager();
    this.renderer = new CanvasRenderer(this.config);

    this.layoutParser = new LayoutParser();
    this.layoutResolver = new LayoutResolver();

    this.tokenEngine = new TokenEngine();
    this.styleEngine = new StyleEngine(this.tokenEngine);

    this.themeManager = new ThemeManager();
    const { registerDefaultThemes } = require('../canvas/themes/index');
    registerDefaultThemes(this.themeManager);

    this.pluginManager = new PluginManager(this);
    this.componentRegistry = new ComponentRegistry();

    // Register core components
    this.registerComponents();

    // Render pipeline hooks
    this.hooks = {
      beforeRender: [],
      afterRender: [],
      beforeComponent: [],
      afterComponent: [],
      preLayout: [],
      postLayout: []
    };

    this.setupEventForwarding();
  }

  /**
   * Set up event forwarding from renderer
   * @private
   */
  setupEventForwarding() {
    this.renderer.on('render:start', (data) => this.emit('render:start', data));
    this.renderer.on('render:complete', (data) => this.emit('render:complete', data));
    this.renderer.on('render:error', (err) => this.emit('render:error', err));
  }

  /**
   * Register default components
   * @private
   */
  registerComponents() {
    // UI Components
    this.componentRegistry.register('text', TextComponent);
    this.componentRegistry.register('avatar', AvatarComponent);
    this.componentRegistry.register('progress', ProgressComponent);
    this.componentRegistry.register('media', MediaComponent);
    this.componentRegistry.register('image', MediaComponent);
    this.componentRegistry.register('album-art', MediaComponent);
    this.componentRegistry.register('banner', MediaComponent);
    this.componentRegistry.register('container', ContainerComponent);
    this.componentRegistry.register('box', ContainerComponent);
    this.componentRegistry.register('level-box', ContainerComponent);
    this.componentRegistry.register('stat-box', ContainerComponent);

    // Card Controllers — each type uses its own dedicated renderer
    this.componentRegistry.register('rank-card', RankCardRenderer);
    this.componentRegistry.register('music-card', MusicCardRenderer);
    this.componentRegistry.register('leaderboard-card', LeaderboardCardRenderer);
    this.componentRegistry.register('invite-card', InviteCardRenderer);
    this.componentRegistry.register('profile-card', ProfileCardRenderer);
    this.componentRegistry.register('welcome-card', WelcomeCardRenderer);

    // Generic fallback
    this.componentRegistry.register('card', RankCardRenderer);
  }

  // ==================== Builder Factory Methods ====================

  /**
   * Create a new generic card builder instance
   * @returns {CardBuilder}
   */
  createCard() {
    return new CardBuilder(this);
  }

  /**
   * Create a rank card builder
   * @returns {RankCardBuilder}
   */
  createRankCard() {
    const RankCardBuilder = require('./RankCardBuilder');
    return new RankCardBuilder(this);
  }

  /**
   * Create a music card builder
   * @returns {MusicCardBuilder}
   */
  createMusicCard() {
    const MusicCardBuilder = require('./MusicCardBuilder');
    return new MusicCardBuilder(this);
  }

  /**
   * Create a leaderboard card builder
   * @returns {LeaderboardCardBuilder}
   */
  createLeaderboardCard() {
    const LeaderboardCardBuilder = require('./LeaderboardCardBuilder');
    return new LeaderboardCardBuilder(this);
  }

  /**
   * Create an invite card builder
   * @returns {InviteCardBuilder}
   */
  createInviteCard() {
    const InviteCardBuilder = require('./InviteCardBuilder');
    return new InviteCardBuilder(this);
  }

  /**
   * Create a profile card builder
   * @returns {ProfileCardBuilder}
   */
  createProfileCard() {
    const ProfileCardBuilder = require('./ProfileCardBuilder');
    return new ProfileCardBuilder(this);
  }

  /**
   * Create a welcome card builder
   * @returns {WelcomeCardBuilder}
   */
  createWelcomeCard() {
    const WelcomeCardBuilder = require('./WelcomeCardBuilder');
    return new WelcomeCardBuilder(this);
  }

  // ==================== Plugin System ====================

  /**
   * Register a plugin
   * @param {Object} plugin - Plugin instance
   * @returns {Engine}
   * @throws {Error} If plugin is invalid
   */
  use(plugin) {
    this.pluginManager.register(plugin);
    return this;
  }

  // ==================== Theme System ====================

  /**
   * Set active theme
   * @param {string} themeName - Theme identifier
   * @returns {Engine}
   */
  setTheme(themeName) {
    this.themeManager.setActive(themeName);
    return this;
  }

  /**
   * Register a custom theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme definition
   * @param {string} [base] - Base theme
   * @returns {Engine}
   */
  registerTheme(name, theme, base = null) {
    this.themeManager.register(name, theme, base);
    return this;
  }

  /**
   * Extend an existing theme
   * @param {string} baseName - Base theme name
   * @param {string} newName - New theme name
   * @param {Object} overrides - Theme overrides
   * @returns {Object} - The new theme
   */
  extendTheme(baseName, newName, overrides) {
    return this.themeManager.extend(baseName, newName, overrides);
  }

  // ==================== Token System ====================

  /**
   * Define a design token
   * @param {string} name - Token name (e.g., 'accent.primary')
   * @param {*} value - Token value
   * @returns {Engine}
   */
  defineToken(name, value) {
    this.tokenEngine.define(name, value);
    return this;
  }

  /**
   * Define multiple tokens at once
   * @param {Object} tokens - Token definitions
   * @returns {Engine}
   */
  defineTokens(tokens) {
    if (tokens && typeof tokens === 'object') {
      this.tokenEngine.defineBatch(tokens);
    }
    return this;
  }

  // ==================== Component System ====================

  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Function} ComponentClass - Component class
   * @returns {Engine}
   */
  registerComponent(name, ComponentClass) {
    this.componentRegistry.register(name, ComponentClass);
    return this;
  }

  /**
   * Override a component renderer
   * @param {string} name - Component name
   * @param {Function} ComponentClass - Component class
   * @returns {Engine}
   */
  overrideComponent(name, ComponentClass) {
    this.componentRegistry.register(name, ComponentClass);
    return this;
  }

  // ==================== Hook System ====================

  /**
   * Register a hook
   * @param {string} event - Hook name
   * @param {Function} callback - Hook callback
   * @returns {Engine}
   * @throws {Error} If event is invalid
   */
  onHook(event, callback) {
    const validEvents = ['beforeRender', 'afterRender', 'beforeComponent', 'afterComponent', 'preLayout', 'postLayout'];
    if (!validEvents.includes(event)) {
      throw new Error(`Invalid hook event: ${event}. Valid events: ${validEvents.join(', ')}`);
    }
    if (typeof callback !== 'function') {
      throw new Error('Hook callback must be a function');
    }
    this.hooks[event].push(callback);
    return this;
  }

  /**
   * Execute hooks
   * @private
   */
  async executeHooks(event, context) {
    const callbacks = this.hooks[event];
    if (!callbacks || callbacks.length === 0) return;

    for (const callback of callbacks) {
      await callback(context);
    }
  }

  // ==================== Rendering ====================

  /**
   * Main render method
   * @param {Object} layout - Card layout definition
   * @param {Object} [data={}] - Card data
   * @param {Object} [options={}] - Render options
   * @returns {Promise<Buffer>} - Rendered image buffer
   */
  async render(layout, data = {}, options = {}) {
    const pipeline = require('./RenderPipeline');
    return pipeline.execute(this, layout, data, options);
  }

  /**
   * Render a card from preset
   * @param {string} preset - Preset name
   * @param {Object} [data={}] - Card data
   * @param {Object} [options={}] - Render options
   * @returns {Promise<Buffer>}
   */
  async renderPreset(preset, data = {}, options = {}) {
    const card = this.createCard().setPreset(preset).setData(data);
    return card.render(options);
  }

  // ==================== Cache Management ====================

  /**
   * Clear asset cache
   */
  clearCache() {
    this.cache.clear();
    this.assetLoader.clearErrors();
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.maxSize
    };
  }

  // ==================== Utility ====================

  /**
   * Get engine version
   * @returns {string}
   */
  getVersion() {
    try {
      const pkg = require('../../package.json');
      return pkg.version;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get all registered themes
   * @returns {string[]}
   */
  listThemes() {
    return this.themeManager.list();
  }

  /**
   * Get all registered components
   * @returns {string[]}
   */
  listComponents() {
    return this.componentRegistry.list();
  }

  /**
   * Get all registered plugins
   * @returns {string[]}
   */
  listPlugins() {
    return this.pluginManager.list();
  }
}

/**
 * Factory function to create a new Engine instance
 * @param {Object} options 
 * @returns {Engine}
 */
function createEngine(options = {}) {
  return new Engine(options);
}

module.exports = { Engine, createEngine };

