/**
 * BaseComponent - Abstract base class for all components
 * @module BaseComponent
 */

'use strict';

/**
 * BaseComponent - Abstract base class for all rendering components
 */
class BaseComponent {
  /**
   * @param {string} type - Component type identifier
   * @param {Object} [props={}] - Component properties
   */
  constructor(type, props = {}) {
    if (!type || typeof type !== 'string') {
      throw new Error('Component type must be a non-empty string');
    }

    this.type = type;
    this.props = props;
    this.style = {};
    this.hooks = {
      beforeRender: [],
      afterRender: [],
      onError: []
    };
  }

  /**
   * Set component style
   * @param {Object} style - Style object
   * @returns {BaseComponent}
   */
  setStyle(style) {
    this.style = { ...this.style, ...style };
    return this;
  }

  /**
   * Register a hook
   * @param {string} event - Hook name (beforeRender|afterRender|onError)
   * @param {Function} callback - Hook callback
   * @returns {BaseComponent}
   */
  on(event, callback) {
    if (this.hooks[event]) {
      this.hooks[event].push(callback);
    }
    return this;
  }

  /**
   * Execute hooks
   * @private
   * @param {string} event - Hook name
   * @param {*} args - Arguments to pass
   */
  async executeHooks(event, ...args) {
    const callbacks = this.hooks[event];
    if (!callbacks || callbacks.length === 0) return;

    for (const callback of callbacks) {
      await callback(...args);
    }
  }

  /**
   * Main render method - orchestrates hooks and internal render
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} bounds - Layout bounds {x, y, width, height}
   * @param {Object} styles - Computed styles
   * @param {Object} tokens - Resolved tokens
   * @returns {Promise<*>}
   */
  async render(ctx, bounds, styles, tokens) {
    await this.executeHooks('beforeRender', ctx, { bounds, props: this.props });

    try {
      const result = await this._render(ctx, bounds, styles, tokens);
      await this.executeHooks('afterRender', ctx, { bounds, result });
      return result;
    } catch (err) {
      await this.executeHooks('onError', ctx, { error: err });
      throw err;
    }
  }

  /**
   * Internal render method - must be implemented by subclasses
   * @protected
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} bounds
   * @param {Object} styles
   * @param {Object} tokens
   * @returns {Promise<*>}
   */
  async _render(ctx, bounds, styles, tokens) {
    throw new Error('_render must be implemented by subclass');
  }

  /**
   * Get a value from props or fallback
   * @protected
   * @param {string} key - Property key
   * @param {*} [fallback=null] - Default value
   * @returns {*}
   */
  getProp(key, fallback = null) {
    return this.props[key] !== undefined ? this.props[key] : fallback;
  }

  /**
   * Get token value
   * @protected
   * @param {Object} tokens - Tokens object
   * @param {string} key - Token key
   * @param {*} [fallback=null] - Fallback value
   * @returns {*}
   */
  getToken(tokens, key, fallback = null) {
    if (!tokens) return fallback;
    return tokens[key] !== undefined ? tokens[key] : fallback;
  }

  /**
   * Get style value
   * @protected
   * @param {string} key - Style key
   * @param {*} [fallback=null] - Fallback value
   * @returns {*}
   */
  getStyle(key, fallback = null) {
    return this.style[key] !== undefined ? this.style[key] : fallback;
  }

  /**
   * Scale value by DPI
   * @protected
   * @param {number} value - Value to scale
   * @param {number} [dpi=2] - DPI value
   * @returns {number}
   */
  scale(value, dpi = 2) {
    return value * dpi;
  }

  /**
   * Round rectangle path
   * @protected
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {number} r
   */
  roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Set shadow
   * @protected
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} color
   * @param {number} blur
   * @param {number} [x=0]
   * @param {number} [y=0]
   */
  setShadow(ctx, color, blur, x = 0, y = 0) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
  }

  /**
   * Clear shadow
   * @protected
   * @param {CanvasRenderingContext2D} ctx
   */
  clearShadow(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

/**
 * ComponentRegistry - Manages component registrations
 */
class ComponentRegistry {
  /**
   */
  constructor() {
    this.components = new Map();
    this.registerDefaults();
  }

  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Function} ComponentClass - Component class
   */
  register(name, ComponentClass) {
    if (!name || typeof name !== 'string') {
      throw new Error('Component name must be a non-empty string');
    }
    if (!ComponentClass || typeof ComponentClass !== 'function') {
      throw new Error('ComponentClass must be a function');
    }
    this.components.set(name, ComponentClass);
  }

  /**
   * Get a component class
   * @param {string} name - Component name
   * @returns {Function|undefined}
   */
  get(name) {
    return this.components.get(name);
  }

  /**
   * Check if component exists
   * @param {string} name - Component name
   * @returns {boolean}
   */
  has(name) {
    return this.components.has(name);
  }

  /**
   * Create a component instance
   * @param {string} name - Component name
   * @param {Object} [props={}] - Component props
   * @returns {BaseComponent}
   * @throws {Error} If component is not registered
   */
  create(name, props = {}) {
    const ComponentClass = this.get(name);
    if (!ComponentClass) {
      throw new Error(`Unknown component: ${name}`);
    }
    return new ComponentClass(props);
  }

  /**
   * List registered components
   * @returns {string[]}
   */
  list() {
    return Array.from(this.components.keys());
  }

  /**
   * Register default components
   * @protected
   */
  registerDefaults() {
    // Override in subclasses if needed
  }
}

module.exports = { BaseComponent, ComponentRegistry };
