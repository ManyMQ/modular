/**
 * CanvasRenderer - Handles canvas creation and low-level rendering
 * @module CanvasRenderer
 */

'use strict';

// Lazy-load @napi-rs/canvas (peer dependency)
let _canvas;
function getCanvas() {
  if (!_canvas) {
    _canvas = require('@napi-rs/canvas');
  }
  return _canvas;
}
const EventEmitter = require('events');

/**
 * CanvasRenderer - Manages canvas contexts and rendering operations
 * @extends EventEmitter
 */
class CanvasRenderer extends EventEmitter {
  /**
   * @param {Object} options - Renderer options
   * @param {number} [options.dpi=2] - Default DPI
   * @param {number} [options.maxPoolSize=10] - Canvas pool size
   */
  constructor(options = {}) {
    super();
    this.dpi = options.dpi || 2;
    this.maxPoolSize = options.maxPoolSize || 10;
    this.canvasPool = [];
    this.registeredFonts = new Set();
  }

  /**
   * Create a new render context
   * @param {number} width - Logical width
   * @param {number} height - Logical height
   * @param {number} [dpi] - DPI override
   * @returns {RenderContext}
   */
  createContext(width, height, dpi = this.dpi) {
    const w = Math.floor(width * dpi);
    const h = Math.floor(height * dpi);

    // Get canvas from pool or create new
    const canvas = this._getCanvas(w, h);
    const ctx = canvas.getContext('2d');

    // Set up context
    ctx.scale(dpi, dpi);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    this.emit('context:create', { width, height, dpi });

    return new RenderContext(canvas, ctx, dpi);
  }

  /**
   * Get canvas from pool or create new
   * @private
   * @param {number} w - Width in pixels
   * @param {number} h - Height in pixels
   * @returns {Canvas}
   */
  _getCanvas(w, h) {
    // Find suitable canvas in pool
    const index = this.canvasPool.findIndex(c => c.width >= w && c.height >= h);

    if (index !== -1) {
      const canvas = this.canvasPool.splice(index, 1)[0];
      // Reset canvas
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return canvas;
    }

    // Create new canvas
    return getCanvas().createCanvas(w, h);
  }

  /**
   * Release context back to pool
   * @param {RenderContext} context
   */
  releaseContext(context) {
    const { canvas, ctx } = context;

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Add to pool if space available
    if (this.canvasPool.length < this.maxPoolSize) {
      this.canvasPool.push(canvas);
    }

    this.emit('context:release', {});
  }

  /**
   * Apply FX effect
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} effect
   * @param {string} effect.type - Effect type (glow|blur|shadow|gradient)
   * @param {*} [effect.options] - Effect options
   */
  async applyEffect(ctx, effect) {
    const { type, ...options } = effect;

    switch (type) {
      case 'glow':
        await this._applyGlow(ctx, options);
        break;
      case 'blur':
        await this._applyBlur(ctx, options);
        break;
      case 'shadow':
        await this._applyShadow(ctx, options);
        break;
      case 'gradient':
        await this._applyGradient(ctx, options);
        break;
      default:
        // Silently ignore unknown effects for production stability
        break;
    }
  }

  /**
   * Apply glow effect
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} options
   * @param {string} [options.color='rgba(124, 58, 237, 0.5)']
   * @param {number} [options.blur=20]
   */
  async _applyGlow(ctx, { color = 'rgba(124, 58, 237, 0.5)', blur = 20 }) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
  }

  /**
   * Apply blur effect
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} options
   * @param {number} [options.amount=5]
   */
  async _applyBlur(ctx, { amount = 5 }) {
    ctx.filter = `blur(${amount}px)`;
  }

  /**
   * Apply shadow effect
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} options
   * @param {string} [options.color='rgba(0,0,0,0.3)']
   * @param {number} [options.blur=20]
   * @param {number} [options.offsetX=0]
   * @param {number} [options.offsetY=10]
   */
  async _applyShadow(ctx, {
    color = 'rgba(0,0,0,0.3)',
    blur = 20,
    offsetX = 0,
    offsetY = 10
  }) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
  }

  /**
   * Apply gradient overlay
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} options
   * @param {string} [options.type='linear']
   * @param {string} [options.direction='to-bottom']
   * @param {Array} [options.stops=[]]
   */
  async _applyGradient(ctx, {
    type = 'linear',
    direction = 'to-bottom',
    stops = []
  }) {
    // Gradient application depends on canvas state
    // This is a placeholder for gradient overlay effects
  }

  /**
   * Register a font
   * @param {string} path - Font file path
   * @param {string} family - Font family name
   */
  registerFont(path, family) {
    if (!this.registeredFonts.has(family)) {
      getCanvas().GlobalFonts.registerFromPath(path, family);
      this.registeredFonts.add(family);
    }
  }

  /**
   * Clear canvas pool
   */
  clearPool() {
    this.canvasPool = [];
  }
}

/**
 * RenderContext - Wrapper for canvas and context
 */
class RenderContext {
  /**
   * @param {Canvas} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} dpi
   */
  constructor(canvas, ctx, dpi) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dpi = dpi;
  }

  /**
   * Get canvas dimensions
   * @returns {{width: number, height: number, pixelWidth: number, pixelHeight: number}}
   */
  getDimensions() {
    return {
      width: this.canvas.width / this.dpi,
      height: this.canvas.height / this.dpi,
      pixelWidth: this.canvas.width,
      pixelHeight: this.canvas.height
    };
  }

  /**
   * Release this render context (clear references to allow GC)
   */
  release() {
    this.canvas = null;
    this.ctx = null;
  }
}

module.exports = { CanvasRenderer, RenderContext };
