/**
 * TextComponent - Renders text with typography support
 * @module TextComponent
 */

'use strict';

const { BaseComponent } = require('../base/BaseComponent');

/**
 * TextComponent - Renders text with full typography support
 * @extends BaseComponent
 */
class TextComponent extends BaseComponent {
  /**
   * @param {Object} [props={}] - Component properties
   */
  constructor(props = {}) {
    super('text', props);
  }

  /**
   * Internal render method
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} bounds - Layout bounds
   * @param {Object} styles - Computed styles
   * @param {Object} tokens - Resolved tokens
   * @returns {Promise<Object>}
   */
  async _render(ctx, bounds, styles, tokens) {
    const { x, y } = bounds;
    const text = this.getProp('text', this.getProp('content', ''));
    const size = this.getProp('size', 16);
    const weight = this.getProp('weight', '400');
    const color = this.getProp('color', styles?.typography?.primary || '#ffffff');
    const align = this.getProp('align', 'left');
    const glow = this.getProp('glow', false);
    const glowColor = this.getProp('glowColor', styles?.accent?.glow);
    const maxWidth = this.getProp('maxWidth');
    const fontFamily = this.getProp('font', styles?.typography?.fontFamily || 'Inter');

    const dpi = tokens.dpi || tokens['dpi'] || 2;

    ctx.save();

    // Apply glow
    if (glow && glowColor) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = this.scale(10, dpi);
    }

    // Set font
    ctx.font = `${weight} ${this.scale(size, dpi)}px "${fontFamily}"`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';

    // Handle truncation
    let displayText = text;
    if (maxWidth) {
      displayText = this._truncateText(ctx, text, maxWidth, dpi);
    }

    // Calculate position
    let drawX = x;
    if (align === 'center') {
      drawX = x + (bounds.width / 2);
    } else if (align === 'right') {
      drawX = x + bounds.width;
    }

    // Draw text
    ctx.fillText(displayText, drawX, this.scale(y, dpi));

    ctx.restore();

    // Measure for return value
    const metrics = ctx.measureText(displayText);
    const width = metrics.width / dpi;

    return {
      x,
      y: y - size,
      width,
      height: size
    };
  }

  /**
   * Truncate text to fit max width
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} text - Original text
   * @param {number} maxWidth - Maximum width
   * @param {number} dpi - DPI scale
   * @returns {string}
   */
  _truncateText(ctx, text, maxWidth, dpi) {
    if (!text) return '';
    
    let truncated = text;
    const ellipsis = '...';

    while (truncated.length > 0) {
      const test = truncated + ellipsis;
      const metrics = ctx.measureText(test);
      const width = metrics.width / dpi;

      if (width <= maxWidth) {
        return test;
      }

      truncated = truncated.slice(0, -1);
    }

    return ellipsis;
  }
}

module.exports = { TextComponent };
