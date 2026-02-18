/**
 * AvatarComponent - Renders user avatars with various shapes
 * @module AvatarComponent
 */

'use strict';

const { BaseComponent } = require('./BaseComponent');

// Lazy-load @napi-rs/canvas (peer dependency, may not be installed at import time)
let _loadImage;
function getLoadImage() {
  if (!_loadImage) {
    _loadImage = require('@napi-rs/canvas').loadImage;
  }
  return _loadImage;
}

/**
 * AvatarComponent - Renders user avatars with status indicators
 * @extends BaseComponent
 */
class AvatarComponent extends BaseComponent {
  /**
   * @param {Object} [props={}] - Component properties
   */
  constructor(props = {}) {
    super('avatar', props);
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
    const size = this.getProp('size', Math.min(width, height));
    const variant = this.getProp('variant', 'circle');
    const src = this.getProp('src');
    const borderWidth = this.getProp('borderWidth', 0);
    const borderColor = this.getProp('borderColor', '#ffffff');
    const glow = this.getProp('glow', false);
    const glowColor = this.getProp('glowColor', styles?.accent?.glow || 'rgba(139, 92, 246, 0.4)');
    const status = this.getProp('status');
    const fallbackText = this.getProp('fallback', '?');

    const dpi = tokens.dpi || tokens['dpi'] || 2;
    const half = size / 2;

    ctx.save();

    // Apply glow
    if (glow) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = this.scale(20, dpi);
    }

    // Draw border if specified
    if (borderWidth > 0) {
      ctx.beginPath();
      if (variant === 'circle') {
        ctx.arc(x + half, y + half, half + borderWidth / 2, 0, Math.PI * 2);
      } else if (variant === 'rounded') {
        this.roundRectPath(ctx, x - borderWidth, y - borderWidth, size + borderWidth * 2, size + borderWidth * 2, 12);
      }
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Clear glow after border
      this.clearShadow(ctx);
    }

    // Create clipping path
    ctx.beginPath();
    if (variant === 'circle') {
      ctx.arc(x + half, y + half, half, 0, Math.PI * 2);
    } else if (variant === 'rounded') {
      this.roundRectPath(ctx, x, y, size, size, 12);
    } else {
      ctx.rect(x, y, size, size);
    }
    ctx.closePath();
    ctx.clip();

    // Draw placeholder
    ctx.fillStyle = '#374151';
    ctx.fillRect(x, y, size, size);

    // Draw image
    if (src) {
      try {
        const img = await getLoadImage()(src);
        const scale = Math.max(size / img.width, size / img.height);
        const drawX = x + (size - img.width * scale) / 2;
        const drawY = y + (size - img.height * scale) / 2;

        ctx.drawImage(img, drawX, drawY, img.width * scale, img.height * scale);
      } catch {
        // Draw fallback on error
        this._drawFallback(ctx, x, y, size, fallbackText, dpi);
      }
    } else {
      // Draw fallback for missing source
      this._drawFallback(ctx, x, y, size, fallbackText, dpi);
    }

    ctx.restore();

    // Draw status indicator
    if (status) {
      this._drawStatus(ctx, x, y, size, status, dpi);
    }

    return { x, y, width: size, height: size };
  }

  /**
   * Draw fallback placeholder
   * @private
   */
  _drawFallback(ctx, x, y, size, text, dpi) {
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#9ca3af';
    ctx.font = `${this.scale(size * 0.4, dpi)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(text), x + size / 2, y + size / 2);
  }

  /**
   * Draw status indicator
   * @private
   */
  _drawStatus(ctx, x, y, size, status, dpi) {
    const colors = {
      online: '#22c55e',
      idle: '#f59e0b',
      dnd: '#ef4444',
      offline: '#6b7280',
      streaming: '#a855f7'
    };

    const color = colors[status] || colors.offline;
    const statusRadius = this.scale(6, dpi);
    const statusX = x + size * 0.7;
    const statusY = y + size * 0.7;

    ctx.save();

    // Background ring
    ctx.beginPath();
    ctx.arc(statusX, statusY, statusRadius + this.scale(2, dpi), 0, Math.PI * 2);
    ctx.fillStyle = '#1f2937';
    ctx.fill();

    // Status dot
    ctx.beginPath();
    ctx.arc(statusX, statusY, statusRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  }
}

module.exports = { AvatarComponent };
