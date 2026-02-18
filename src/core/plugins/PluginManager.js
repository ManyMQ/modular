/**
 * PluginManager - Manages plugin registration and lifecycle
 * @module PluginManager
 */

'use strict';

const EventEmitter = require('events');

/**
 * PluginManager - Manages plugin registration, hooks, and lifecycle
 */
class PluginManager extends EventEmitter {
  /**
   * @param {Engine} engine - Parent engine instance
   */
  constructor(engine) {
    super();
    this.engine = engine;
    this.plugins = new Map();
    this.hookEmitter = new EventEmitter();
  }

  /**
   * Register a plugin
   * @param {Object} plugin - Plugin instance
   * @param {string} plugin.name - Unique plugin name
   * @param {Function} [plugin.install] - Installation callback
   * @param {Function} [plugin.uninstall] - Cleanup callback
   * @param {Object} [plugin.components] - Components to register
   * @param {Object} [plugin.themes] - Themes to register
   * @param {Object} [plugin.hooks] - Hooks to register
   * @throws {Error} If plugin name is missing or duplicate
   */
  register(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      throw new Error('Plugin must be a valid object');
    }

    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new Error('Plugin must have a string name');
    }

    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }

    // Initialize plugin
    if (typeof plugin.install === 'function') {
      plugin.install(this.engine);
    }

    this.plugins.set(plugin.name, plugin);

    // Register plugin components
    if (plugin.components && typeof plugin.components === 'object') {
      for (const [name, ComponentClass] of Object.entries(plugin.components)) {
        this.engine.componentRegistry.register(name, ComponentClass);
      }
    }

    // Register plugin themes
    if (plugin.themes && typeof plugin.themes === 'object') {
      for (const [name, theme] of Object.entries(plugin.themes)) {
        this.engine.themeManager.register(name, theme);
      }
    }

    // Register plugin hooks
    if (plugin.hooks && typeof plugin.hooks === 'object') {
      for (const [event, callback] of Object.entries(plugin.hooks)) {
        this.registerHook(event, callback);
      }
    }

    this.emit('plugin:registered', { name: plugin.name });
  }

  /**
   * Unregister a plugin
   * @param {string} name - Plugin name
   */
  unregister(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    // Run cleanup if available
    if (typeof plugin.uninstall === 'function') {
      plugin.uninstall(this.engine);
    }

    this.plugins.delete(name);
    this.emit('plugin:unregistered', { name });
  }

  /**
   * Get a plugin
   * @param {string} name - Plugin name
   * @returns {Object|undefined}
   */
  get(name) {
    return this.plugins.get(name);
  }

  /**
   * Check if plugin exists
   * @param {string} name - Plugin name
   * @returns {boolean}
   */
  has(name) {
    return this.plugins.has(name);
  }

  /**
   * List all registered plugins
   * @returns {string[]}
   */
  list() {
    return Array.from(this.plugins.keys());
  }

  /**
   * Register a hook callback
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  registerHook(event, callback) {
    this.hookEmitter.on(event, callback);
  }

  /**
   * Emit a hook event
   * @param {string} event - Event name
   * @param {*} data - Data to pass
   */
  emitHook(event, data) {
    this.hookEmitter.emit(event, data);
  }
}

/**
 * BasePlugin - Base class for creating plugins
 */
class BasePlugin {
  /**
   * @param {string} name - Plugin name
   */
  constructor(name) {
    this.name = name;
    this.components = {};
    this.themes = {};
    this.hooks = {};
  }

  /**
   * Install hook - called when plugin is registered
   * @param {Engine} engine
   */
  install(engine) {
    // Override in subclass
  }

  /**
   * Uninstall hook - called when plugin is unregistered
   * @param {Engine} engine
   */
  uninstall(engine) {
    // Override in subclass
  }

  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Function} ComponentClass - Component class
   */
  registerComponent(name, ComponentClass) {
    this.components[name] = ComponentClass;
  }

  /**
   * Register a theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme definition
   */
  registerTheme(name, theme) {
    this.themes[name] = theme;
  }

  /**
   * Register a hook
   * @param {string} event - Event name
   * @param {Function} callback - Hook callback
   */
  registerHook(event, callback) {
    this.hooks[event] = callback;
  }
}

module.exports = { PluginManager, BasePlugin };
