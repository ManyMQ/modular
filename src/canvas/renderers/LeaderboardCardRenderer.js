'use strict';

const { BaseComponent } = require('../components/BaseComponent');
const { setAlpha } = require('../utils/color');
const {
    renderCardBackground, renderThemeDecorations,
    renderAvatar, drawIcon, getFontWeight
} = require('./shared/effects');

class LeaderboardCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('leaderboard-card', options);
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
        const x = pad;
        const y = pad;

        const grad = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
        grad.addColorStop(0, 'rgba(88,101,242,0.1)'); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

        // Header
        const headerHeight = 80;
        const titleY = y + 10;
        const iconBoxSize = 40;
        ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
        this.roundRectPath(ctx, x, titleY, iconBoxSize, iconBoxSize, 12); ctx.fill();
        drawIcon(ctx, x + iconBoxSize / 2, titleY + iconBoxSize / 2, 20, 'trophy', '#FFFFFF', v => v);

        const titleX = x + iconBoxSize + 12;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = `${getFontWeight('bold')} 20px Inter, sans-serif`; ctx.fillStyle = '#FFFFFF';
        ctx.fillText(data.title || 'Server Leaderboard', titleX, titleY);
        ctx.font = `${getFontWeight('medium')} 14px Inter, sans-serif`; ctx.fillStyle = '#9CA3AF';
        ctx.fillText(data.subtitle || 'Top 5 Members', titleX, titleY + 24);

        if (data.season) {
            ctx.font = `${getFontWeight('semibold')} 14px Inter, sans-serif`;
            const sW = ctx.measureText(data.season).width + 24; const sH = 32;
            const sX = width - pad - sW; const sY = titleY;
            ctx.fillStyle = 'rgba(88,101,242,0.2)'; ctx.strokeStyle = 'rgba(88,101,242,0.5)'; ctx.lineWidth = 1;
            this.roundRectPath(ctx, sX, sY, sW, sH, 10); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#5865F2'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(data.season, sX + sW / 2, sY + sH / 2);
        }

        const entries = data.entries || [];
        let curY = y + headerHeight;
        const rowH = 72; const gap = 12;
        const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

        for (let i = 0; i < Math.min(entries.length, 5); i++) {
            const entry = entries[i];
            const isTop3 = i < 3;

            ctx.fillStyle = isTop3 ? 'rgba(88,101,242,0.1)' : '#1E1F22';
            this.roundRectPath(ctx, x, curY, width - x * 2, rowH, 12); ctx.fill();
            if (isTop3) { ctx.strokeStyle = 'rgba(88,101,242,0.3)'; ctx.lineWidth = 1; ctx.stroke(); }

            // Rank badge
            const rSize = 32; const rX = x + 12; const rY2 = curY + (rowH - rSize) / 2;
            ctx.fillStyle = isTop3 ? (tokens['accent.primary'] || '#5865F2') : 'rgba(255,255,255,0.05)';
            this.roundRectPath(ctx, rX, rY2, rSize, rSize, 8); ctx.fill();
            ctx.font = `${getFontWeight('bold')} 14px Inter, sans-serif`;
            ctx.fillStyle = isTop3 ? rankColors[i] : '#9CA3AF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(String(i + 1), rX + rSize / 2, rY2 + rSize / 2);

            // Avatar
            const avSize = 48; const avX = rX + rSize + 16; const avY = curY + (rowH - avSize) / 2;
            if (isTop3) {
                ctx.strokeStyle = tokens['accent.primary'] || '#5865F2'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2 + 2, 0, Math.PI * 2); ctx.stroke();
            }
            await renderAvatar(ctx, avX, avY, avSize, entry.avatar, tokens,
                v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r),
                src => this.loadImage(src), getFontWeight, true);

            // Name & stats
            const nameX = avX + avSize + 16; const textY = curY + rowH / 2;
            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
            ctx.font = `${getFontWeight('semibold')} 16px Inter, sans-serif`; ctx.fillStyle = '#FFFFFF';
            ctx.fillText(entry.username || 'User', nameX, textY - 2);
            ctx.textBaseline = 'top';
            ctx.font = `${getFontWeight('normal')} 12px Inter, sans-serif`; ctx.fillStyle = '#9CA3AF';
            ctx.fillText(`Level ${entry.level || 1}`, nameX, textY + 2);

            const scoreX = width - pad - 12;
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            ctx.font = `${getFontWeight('bold')} 16px Inter, sans-serif`; ctx.fillStyle = '#FFFFFF';
            ctx.fillText((entry.score || 0).toLocaleString(), scoreX, textY - 8);
            ctx.font = `${getFontWeight('bold')} 10px Inter, sans-serif`; ctx.fillStyle = '#5865F2';
            ctx.fillText('XP', scoreX, textY + 8);

            curY += rowH + gap;
        }
    }
}

module.exports = { LeaderboardCardRenderer };
