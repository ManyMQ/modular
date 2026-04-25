'use strict';

const { loadImage } = require('@napi-rs/canvas');
const { BaseComponent } = require('../components/BaseComponent');
const {
    renderCardBackground, renderThemeDecorations, getFontWeight
} = require('./shared/effects');

class WelcomeCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('welcome-card', options);
        this.data = options.data || {};
    }

    scale(value) { return value; }

    async _render(ctx, bounds, styles, tokens) {
        const { width, height } = bounds;
        await renderCardBackground(ctx, width, height, tokens, v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r));
        await renderThemeDecorations(ctx, width, height, tokens, 'background', v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r));
        await this._renderContent(ctx, width, height, tokens);
        renderThemeDecorations(ctx, width, height, tokens, 'foreground', v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r));
    }

    async _renderContent(ctx, width, height, tokens) {
        const data = this.data;
        const avSize = Math.max(88, Math.min(112, Math.round(height * 0.32)));
        const avX = (width - avSize) / 2;
        const avY = Math.max(16, Math.round(height * 0.08));
        const titleY = avY + avSize + 42;
        const subtitleY = titleY + 42;

        await this._renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens);

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `${getFontWeight('bold')} 36px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.primary'];
        ctx.fillText(data.welcomeMessage || `Welcome, ${data.username || 'User'}!`, width / 2, titleY);

        ctx.font = `${getFontWeight('medium')} 16px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.muted'];
        ctx.fillText(data.subtitle || 'Glad to have you here!', width / 2, subtitleY);
    }

    async _renderAvatar(ctx, x, y, size, src, tokens) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = tokens['surface.tertiary'] || '#20242f';
        ctx.fillRect(x, y, size, size);

        if (src) {
            try {
                const img = await loadImage(src);
                ctx.drawImage(img, x, y, size, size);
            } catch {
                // Keep neutral fallback; do not render question mark icon.
            }
        }
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = tokens['accent.primary'] || '#F472B6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

module.exports = { WelcomeCardRenderer };
