'use strict';

const { BaseComponent } = require('../components/BaseComponent');
const { createLinearGradient, setShadow, clearShadow } = require('../utils/canvas');
const { setAlpha } = require('../utils/color');
const {
    renderCardBackground, renderThemeDecorations,
    renderAvatar, drawIcon, drawHexagon, drawPolygonClip, getFontWeight
} = require('./shared/effects');

class RankCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('rank-card', options);
        this.data = options.data || {};
    }

    scale(value) { return value; } // DPI already applied by CanvasRenderer context

    async _render(ctx, bounds, styles, tokens) {
        const { width, height } = bounds;
        await renderCardBackground(ctx, width, height, tokens, v => this.scale(v), (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r));
        await renderThemeDecorations(ctx, width, height, tokens, 'background', v => this.scale(v), (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r));
        await this._renderContent(ctx, width, height, tokens);
        renderThemeDecorations(ctx, width, height, tokens, 'foreground', v => this.scale(v), (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r));
    }

    async _renderContent(ctx, width, height, tokens) {
        const data = this.data;
        const pad = tokens['spacing.lg'] || 24;
        const x = pad;
        const y = pad;

        const accentColor = tokens['rank.color.accent'] || tokens['accent.primary'] || '#5865F2';
        const accentSecondary = tokens['accent.secondary'] || accentColor;
        const statsColor = tokens['rank.color.stats'] || tokens['text.primary'] || '#FFFFFF';
        const mutedColor = tokens['rank.color.muted'] || tokens['text.muted'] || '#9CA3AF';
        const labelColor = tokens['rank.color.label'] || tokens['text.muted'] || '#9CA3AF';

        const labels = { rank: 'Rank', level: 'Level', xp: 'Experience', ...(data.labels || {}) };

        const avatarSize = 180;
        const progressHeight = 22;
        const avatarX = x + 10;
        const avatarY = (height - avatarSize) / 2 - 15;
        const avatarShape = tokens['avatar.shape'] || 'circle';

        // Avatar glow
        ctx.save();
        ctx.filter = `blur(20px)`;
        ctx.fillStyle = setAlpha(accentColor, 0.4);
        ctx.beginPath();
        if (avatarShape === 'hexagon') drawHexagon(ctx, avatarX, avatarY, avatarSize);
        else if (avatarShape === 'polygon-clip') drawPolygonClip(ctx, avatarX, avatarY, avatarSize);
        else this.roundRectPath(ctx, avatarX, avatarY, avatarSize, avatarSize, tokens['rank.radius.avatar'] || 16);
        ctx.fill();
        ctx.restore();

        // Avatar border fill
        ctx.save();
        const borderSize = 3;
        ctx.fillStyle = accentColor;
        if (avatarShape === 'hexagon') drawHexagon(ctx, avatarX - borderSize, avatarY - borderSize, avatarSize + borderSize * 2);
        else if (avatarShape === 'polygon-clip') drawPolygonClip(ctx, avatarX - borderSize, avatarY - borderSize, avatarSize + borderSize * 2);
        else this.roundRectPath(ctx, avatarX - borderSize, avatarY - borderSize, avatarSize + borderSize * 2, avatarSize + borderSize * 2, (tokens['rank.radius.avatar'] || 16) + 4);
        ctx.fill();

        await renderAvatar(ctx, avatarX, avatarY, avatarSize, data.avatar, tokens,
            v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r),
            src => this.loadImage(src), getFontWeight, true);
        ctx.restore();

        // Level badge
        if (!tokens['effect.levelCircle']) {
            const badgeSize = 48;
            const badgeX = avatarX + avatarSize - badgeSize * (tokens['effect.overlapLevelBadge'] ? 0.8 : 0.55);
            const badgeY = avatarY + avatarSize - badgeSize * (tokens['effect.overlapLevelBadge'] ? 0.8 : 0.55);

            ctx.save();
            ctx.fillStyle = tokens['surface.elevated'] || tokens['surface.secondary'] || '#1E1F22';
            this.roundRectPath(ctx, badgeX - 3, badgeY - 3, badgeSize + 6, badgeSize + 6, (tokens['rank.radius.badge'] || 10) + 2);
            ctx.fill();

            ctx.fillStyle = createLinearGradient(ctx, badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize, [
                { pos: 0, color: accentColor },
                { pos: 1, color: tokens['effect.gradientProgress'] ? accentSecondary : accentColor }
            ]);
            this.roundRectPath(ctx, badgeX, badgeY, badgeSize, badgeSize, tokens['rank.radius.badge'] || 10);
            ctx.fill();

            ctx.font = `${getFontWeight('bold')} ${tokens['rank.font.size.badge'] || 18}px Inter, sans-serif`;
            ctx.fillStyle = tokens['text.primary'] || '#FFFFFF';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(String(data.level || 0), badgeX + badgeSize / 2, badgeY + badgeSize / 2);
            ctx.restore();
        }

        // Circular level indicator
        if (tokens['effect.levelCircle']) {
            const lW = 80;
            const lX = width - x - lW - 10;
            const lY = avatarY + (avatarSize - lW) / 2;
            ctx.save();
            ctx.beginPath(); ctx.arc(lX + lW / 2, lY + lW / 2, lW / 2, 0, Math.PI * 2);
            ctx.lineWidth = 4; ctx.strokeStyle = tokens['surface.tertiary'] || '#111'; ctx.stroke();

            const prog = Math.min((data.xp || 0) / (data.maxXp || 1000), 1);
            ctx.beginPath(); ctx.arc(lX + lW / 2, lY + lW / 2, lW / 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog);
            ctx.strokeStyle = tokens['accent.primary'] || '#00f0ff'; ctx.lineWidth = 4;
            ctx.shadowColor = tokens['accent.glow']; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;

            ctx.fillStyle = tokens['accent.secondary'] || '#ff00ff';
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.font = `${getFontWeight('bold')} 10px Orbitron, sans-serif`;
            ctx.fillText('LVL', lX + lW / 2, lY + lW / 2 - 2);

            ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'top';
            ctx.font = `${getFontWeight('bold')} 24px Orbitron, sans-serif`;
            ctx.fillText(String(data.level || 0), lX + lW / 2, lY + lW / 2 + 2);
            ctx.restore();
        }

        // Info section
        const infoX = avatarX + avatarSize + 32;
        let curY = avatarY + 4;

        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = `${getFontWeight('bold')} ${tokens['rank.font.size.name'] || 52}px Inter, sans-serif`;
        ctx.fillStyle = statsColor;
        const name = data.username || 'User';
        ctx.fillText(name, infoX, curY);

        const nameW = ctx.measureText(name).width;
        const displayTag = data.discriminator && data.discriminator !== '0' && data.discriminator !== '0000'
            ? `#${data.discriminator}`
            : (data.tag && data.tag !== data.username ? data.tag : '');
        if (displayTag) {
            ctx.font = `${getFontWeight('normal')} 26px Inter, sans-serif`;
            ctx.fillStyle = mutedColor;
            ctx.fillText(displayTag, infoX + nameW + 14, curY + 20);
        }

        curY += 68;
        ctx.font = `${getFontWeight('semibold')} ${tokens['rank.font.size.labels'] || 24}px Inter, sans-serif`;
        ctx.fillStyle = statsColor;
        ctx.fillText(labels.rank, infoX, curY);
        const labelW = ctx.measureText(labels.rank).width;
        ctx.fillStyle = accentColor;
        ctx.fillText(`#${data.rank || 1}`, infoX + labelW + 10, curY);

        let statsOffset = infoX + 180;
        if (data.showMessages !== false && data.messages !== undefined) {
            drawIcon(ctx, statsOffset, curY + 14, 24, 'users', mutedColor, v => v);
            ctx.font = `${getFontWeight('medium')} ${tokens['rank.font.size.stats'] || 22}px Inter, sans-serif`;
            ctx.fillStyle = statsColor;
            ctx.fillText(`${data.messages.toLocaleString()} msgs`, statsOffset + 36, curY + 2);
            statsOffset += 165;
        }
        if (data.showVoice !== false && data.voiceTime !== undefined) {
            drawIcon(ctx, statsOffset, curY + 14, 24, 'volume', mutedColor, v => v);
            ctx.font = `${getFontWeight('medium')} ${tokens['rank.font.size.stats'] || 22}px Inter, sans-serif`;
            ctx.fillStyle = statsColor;
            ctx.fillText(`${Math.floor(data.voiceTime / 3600)}h voice`, statsOffset + 36, curY + 2);
        }

        // Level box
        if (!tokens['effect.overlapLevelBadge'] && !tokens['effect.levelCircle']) {
            const lW = 150; const lH = 70;
            const lX = width - x - lW - 5; const lY2 = avatarY + 8;
            ctx.save();
            ctx.fillStyle = setAlpha(accentColor, 0.2);
            ctx.strokeStyle = setAlpha(accentColor, 0.4);
            ctx.lineWidth = 2.5;
            this.roundRectPath(ctx, lX, lY2, lW, lH, tokens['rank.radius.levelBox'] || 18);
            ctx.fill(); ctx.stroke();
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.font = `${getFontWeight('bold')} ${tokens['rank.font.size.level'] || 28}px Inter, sans-serif`;
            ctx.fillStyle = accentColor;
            ctx.fillText(`${labels.level} ${data.level || 0}`, lX + lW / 2, lY2 + lH / 2);
            ctx.restore();
        }

        // Progress bar
        const barW = width - infoX - x - 15;
        const barY = height - y - progressHeight - 10;
        const labelY = barY - 22;

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = `${getFontWeight('medium')} ${tokens['rank.font.size.stats'] || 22}px Inter, sans-serif`;
        ctx.fillStyle = labelColor;
        ctx.fillText(labels.xp, infoX, labelY);

        ctx.textAlign = 'right'; ctx.fillStyle = statsColor;
        ctx.font = `${getFontWeight('semibold')} ${tokens['rank.font.size.stats'] || 22}px Inter, sans-serif`;
        ctx.fillText(`${(data.xp || 0).toLocaleString()} / ${(data.maxXp || 1000).toLocaleString()}`, infoX + barW, labelY);

        ctx.fillStyle = tokens['surface.secondary'] || '#1E1F22';
        this.roundRectPath(ctx, infoX, barY, barW, progressHeight, progressHeight / 2);
        ctx.fill();

        const progress = Math.min((data.xp || 0) / (data.maxXp || 1000), 1);
        const fillW = barW * progress;
        if (fillW > 0) {
            const grad = ctx.createLinearGradient(infoX, 0, infoX + fillW, 0);
            grad.addColorStop(0, accentColor);
            grad.addColorStop(1, tokens['effect.gradientProgress'] ? accentSecondary : setAlpha(accentColor, 0.8));
            ctx.save();
            ctx.shadowColor = setAlpha(accentColor, 0.6); ctx.shadowBlur = 20;
            ctx.fillStyle = grad;
            this.roundRectPath(ctx, infoX, barY, fillW, progressHeight, progressHeight / 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

module.exports = { RankCardRenderer };
