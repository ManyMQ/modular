/**
 * MediaComponent - Renders images and media content
 * @module MediaComponent
 */

'use strict';

const { BaseComponent } = require('../base/BaseComponent');

/**
 * MediaComponent - Renders images with scaling and cropping
 * @extends BaseComponent
 */
class MediaComponent extends BaseComponent {
  /**
   * @param {Object} [props={}] - Component properties
   */
  constructor(props = {}) {
    super('media', props);
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
    const { x, y, width, height } = bounds;
    const src = this.getProp('src', this.getProp('url', this.getProp('image')));
    const fit = this.getProp('fit', 'cover');
    const cornerRadius = this.getProp('cornerRadius', 0);
    const placeholderColor = this.getProp('placeholderColor', '#1f2937');

    const dpi = tokens.dpi || tokens['dpi'] || 2;
    const scaledRadius = this.scale(cornerRadius, dpi);

    ctx.save();

    // Apply corner radius clipping
    if (scaledRadius > 0) {
      ctx.beginPath();
      this._roundRectPath(ctx, x, y, width, height, scaledRadius);
      ctx.clip();
    }

    // Draw placeholder
    ctx.fillStyle = placeholderColor;
    ctx.fillRect(x, y, width, height);

    // Draw image if available
    if (src) {
      try {
        const { loadImage } = require('@napi-rs/canvas');
        const img = await loadImage(src);

        // Calculate scaling to fit
        let drawX = x;
        let drawY = y;
        let drawWidth = width;
        let drawHeight = height;

        if (fit === 'contain') {
          const scale = Math.min(width / img.width, height / img.height);
          drawWidth = img.width * scale;
          drawHeight = img.height * scale;
          drawX = x + (width - drawWidth) / 2;
          drawY = y + (height - drawHeight) / 2;
        } else if (fit === 'cover') {
          const scale = Math.max(width / img.width, height / img.height);
          drawWidth = img.width * scale;
          drawHeight = img.height * scale;
          drawX = x + (width - drawWidth) / 2;
          drawY = y + (height - drawHeight) / 2;
        } else {
          // Stretch to fill
          drawWidth = width;
          drawHeight = height;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      } catch {
        // Silently fail - placeholder remains visible
      }
    }

    ctx.restore();

    return { x, y, width, height };
  }

  /**
   * Draw rounded rectangle path
   * @private
   */
  _roundRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

module.exports = { MediaComponent };
