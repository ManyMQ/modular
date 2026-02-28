'use strict';

const { BaseComponent } = require('../components/BaseComponent');
const { setAlpha } = require('../utils/color');
const {
    renderCardBackground, renderThemeDecorations,
    renderAvatar, getFontWeight
} = require('./shared/effects');

class ProfileCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('profile-card', options);
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
        const pad = tokens['spacing.lg'] || 24;
        const avSize = 140;
        const avX = pad * 2;
        const avY = (height - avSize) / 2;

        // Background accent
        ctx.save();
        ctx.fillStyle = setAlpha(tokens['accent.primary'], 0.1);
        ctx.fillRect(0, 0, width * 0.3, height);
        ctx.restore();

        await renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens,
            v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r),
            src => this.loadImage(src), getFontWeight, true);

        const infoX = avX + avSize + pad * 2;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.font = `${getFontWeight('bold')} 42px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.primary'];
        ctx.fillText(data.username || 'User', infoX, height / 2 - 10);
        ctx.font = `${getFontWeight('medium')} 18px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.muted'];
        ctx.fillText(data.title || 'Profile Preview', infoX, height / 2 + 30);
    }
}

module.exports = { ProfileCardRenderer };
