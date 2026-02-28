'use strict';

const { BaseComponent } = require('../components/BaseComponent');
const {
    renderCardBackground, renderThemeDecorations,
    renderAvatar, getFontWeight
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
        const avSize = 120;
        const avX = (width - avSize) / 2;
        const avY = height / 2 - 80;

        await renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens,
            v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r),
            src => this.loadImage(src), getFontWeight, true);

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `${getFontWeight('bold')} 36px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.primary'];
        ctx.fillText(data.welcomeMessage || `Welcome, ${data.username || 'User'}!`, width / 2, height / 2 + 30);

        ctx.font = `${getFontWeight('medium')} 16px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.muted'];
        ctx.fillText(data.subtitle || 'Glad to have you here!', width / 2, height / 2 + 70);
    }
}

module.exports = { WelcomeCardRenderer };
