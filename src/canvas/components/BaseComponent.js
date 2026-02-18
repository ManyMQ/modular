/**
 * BaseComponent - Abstract base class for all components
 * @module BaseComponent
 */

'use strict';

/**
 * BaseComponent - Abstract base class for all rendering components in the Discord Canvas Module.
 * Provides core functionality for styling, life-cycle hooks, and rendering orchestration.
 * 
 * @abstract
 */
class BaseComponent {
  /**
   * @param {string} type - Component type identifier (e.g., 'text', 'avatar')
   * @param {Object} [props={}] - Initial component properties
   * @param {Object} [props.data] - Global card data accessible to the component
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
   * Set or update component styles
   * @param {Object} style - Style properties to merge
   * @returns {BaseComponent} This component instance for method chaining
   */
  setStyle(style) {
    this.style = { ...this.style, ...style };
    return this;
  }

  /**
   * Register a component-level life-cycle hook
   * @param {string} event - Hook name ('beforeRender', 'afterRender', or 'onError')
   * @param {Function} callback - Callback function to execute
   * @returns {BaseComponent} This component instance for method chaining
   */
  on(event, callback) {
    if (this.hooks[event]) {
      this.hooks[event].push(callback);
    }
    return this;
  }

  /**
   * Execute registered hooks for a specific event
   * @private
   * @param {string} event - Hook name
   * @param {...*} args - Arguments to pass to the callbacks
   * @returns {Promise<void>}
   */
  async executeHooks(event, ...args) {
    const callbacks = this.hooks[event];
    if (!callbacks || callbacks.length === 0) return;

    for (const callback of callbacks) {
      await callback(...args);
    }
  }

  /**
   * Main render method - orchestrates hooks and internal render pass
   * 
   * @param {CanvasRenderingContext2D} ctx - Target canvas rendering context
   * @param {Object} bounds - Layout boundaries for the component
   * @param {number} bounds.x - Top-left X coordinate
   * @param {number} bounds.y - Top-left Y coordinate
   * @param {number} bounds.width - Component width
   * @param {number} bounds.height - Component height
   * @param {Object} styles - Computed visual styles from StyleEngine
   * @param {Object} tokens - Resolved design tokens from TokenEngine
   * @returns {Promise<*>} Result of the internal render method
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
   * Internal render implementation - must be implemented by subclasses
   * 
   * @abstract
   * @protected
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} bounds - Resolved node bounds
   * @param {Object} styles - Computed styles
   * @param {Object} tokens - Resolved tokens
   * @returns {Promise<*>}
   */
  async _render(ctx, bounds, styles, tokens) {
    throw new Error('_render must be implemented by subclass');
  }

  /**
   * Helper to retrieve a property with a fallback value
   * @protected
   * @param {string} key - Property key
   * @param {*} [fallback=null] - Default value if property is missing
   * @returns {*} Resolved property value
   */
  getProp(key, fallback = null) {
    return this.props[key] !== undefined ? this.props[key] : fallback;
  }

  /**
   * Helper to retrieve a token value with a fallback
   * @protected
   * @param {Object} tokens - Tokens object
   * @param {string} key - Token identifier
   * @param {*} [fallback=null] - Default value
   * @returns {*} Resolved token value
   */
  getToken(tokens, key, fallback = null) {
    if (!tokens) return fallback;
    return tokens[key] !== undefined ? tokens[key] : fallback;
  }

  /**
   * Helper to retrieve a style value with a fallback
   * @protected
   * @param {string} key - Style property key
   * @param {*} [fallback=null] - Default value
   * @returns {*} Resolved style value
   */
  getStyle(key, fallback = null) {
    return this.style[key] !== undefined ? this.style[key] : fallback;
  }

  /**
   * Scales a numerical value by DPI
   * @protected
   * @param {number} value - Base value to scale
   * @param {number} [dpi=2] - Target DPI multiplier
   * @returns {number} Scaled value
   */
  scale(value, dpi = 2) {
    return value * dpi;
  }

  /**
   * Draws a rounded rectangle path on the canvas context
   * @protected
   * @param {CanvasRenderingContext2D} ctx - Target context
   * @param {number} x - Start X coordinate
   * @param {number} y - Start Y coordinate
   * @param {number} w - Rectangle width
   * @param {number} h - Rectangle height
   * @param {number} r - Corner radius
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
   * Applies shadow properties to the canvas context
   * @protected
   * @param {CanvasRenderingContext2D} ctx - Target context
   * @param {string} color - Shadow color (hex/rgba)
   * @param {number} blur - Blur strength in pixels
   * @param {number} [x=0] - Horizontal offset
   * @param {number} [y=0] - Vertical offset
   */
  setShadow(ctx, color, blur, x = 0, y = 0) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
  }

  /**
   * Reset all shadow properties on the context
   * @protected
   * @param {CanvasRenderingContext2D} ctx - Target context
   */
  clearShadow(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

/**
 * ComponentRegistry - Manages registration and instantiation of rendering components
 */
class ComponentRegistry {
  /**
   * Initializes the registry and registers default core components
   */
  constructor() {
    this.components = new Map();
    this.registerDefaults();
  }

  /**
   * Register a new component class in the engine
   * @param {string} name - Unique identifier for the component type
   * @param {typeof BaseComponent} ComponentClass - Class extending BaseComponent
   * @throws {Error} If name or ComponentClass is invalid
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
   * Retrieve a component class by its registered name
   * @param {string} name - Component type identifier
   * @returns {typeof BaseComponent|undefined} The registered component class or undefined
   */
  get(name) {
    return this.components.get(name);
  }

  /**
   * Check if a component type is registered
   * @param {string} name - Component identifier
   * @returns {boolean} True if registered
   */
  has(name) {
    return this.components.has(name);
  }

  /**
   * Create a new instance of a registered component
   * @param {string} name - Component identifier
   * @param {Object} [props={}] - Properties to pass to constructor
   * @returns {BaseComponent} New component instance
   * @throws {Error} If component type is not registered
   */
  create(name, props = {}) {
    const ComponentClass = this.get(name);
    if (!ComponentClass) {
      throw new Error(`Unknown component: ${name}`);
    }
    return new ComponentClass(props);
  }

  /**
   * Get a list of all registered component identifiers
   * @returns {string[]} Array of component names
   */
  list() {
    return Array.from(this.components.keys());
  }

  /**
   * Register default system components
   * @protected
   */
  registerDefaults() {
    // Override in subclasses if needed
  }
}

module.exports = { BaseComponent, ComponentRegistry };

