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
const { CanvasRenderer } = require('../renderer/CanvasRenderer');
const { AssetLoader } = require('../renderer/AssetLoader');
const { BufferManager } = require('../renderer/BufferManager');
const { LayoutParser } = require('../layout/LayoutParser');
const { LayoutResolver } = require('../layout/LayoutResolver');
const { StyleEngine } = require('../styling/StyleEngine');
const { TokenEngine } = require('../styling/TokenEngine');
const { ThemeManager } = require('../themes/ThemeManager');
const { PluginManager } = require('../plugins/PluginManager');
const { ComponentRegistry } = require('../components/base/BaseComponent');
const { LRUCache } = require('../cache/LRUCache');
const CardBuilder = require('./CardBuilder');

// Builders
const RankCardBuilder = require('../builders/RankCardBuilder');
const MusicCardBuilder = require('../builders/MusicCardBuilder');
const LeaderboardCardBuilder = require('../builders/LeaderboardCardBuilder');
const InviteCardBuilder = require('../builders/InviteCardBuilder');
const ProfileCardBuilder = require('../builders/ProfileCardBuilder');
const WelcomeCardBuilder = require('../builders/WelcomeCardBuilder');

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
    this.pluginManager = new PluginManager(this);
    this.componentRegistry = new ComponentRegistry();

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
    return new RankCardBuilder(this);
  }

  /**
   * Create a music card builder
   * @returns {MusicCardBuilder}
   */
  createMusicCard() {
    return new MusicCardBuilder(this);
  }

  /**
   * Create a leaderboard card builder
   * @returns {LeaderboardCardBuilder}
   */
  createLeaderboardCard() {
    return new LeaderboardCardBuilder(this);
  }

  /**
   * Create an invite card builder
   * @returns {InviteCardBuilder}
   */
  createInviteCard() {
    return new InviteCardBuilder(this);
  }

  /**
   * Create a profile card builder
   * @returns {ProfileCardBuilder}
   */
  createProfileCard() {
    return new ProfileCardBuilder(this);
  }

  /**
   * Create a welcome card builder
   * @returns {WelcomeCardBuilder}
   */
  createWelcomeCard() {
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
      size: this.cache.size(),
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

module.exports = { Engine };
