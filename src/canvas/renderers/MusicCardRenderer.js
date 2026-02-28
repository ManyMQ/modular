'use strict';

const { BaseComponent } = require('../components/BaseComponent');
const { setAlpha } = require('../utils/color');
const {
    renderCardBackground, renderThemeDecorations,
    renderAvatar, drawIcon, getFontWeight
} = require('./shared/effects');

class MusicCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('music-card', options);
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

        // Background effects
        const grad = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
        grad.addColorStop(0, 'rgba(88,101,242,0.1)'); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.filter = `blur(60px)`; ctx.fillStyle = 'rgba(88,101,242,0.2)';
        ctx.beginPath(); ctx.arc(width + 20, height + 20, 128, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Album art
        const artSize = 128;
        const contentH = height - y * 2;
        const artY = y + (contentH - artSize) / 2;
        const artX = x;

        ctx.save();
        ctx.filter = `blur(24px)`;
        const glowGrad = ctx.createLinearGradient(artX, artY, artX + artSize, artY + artSize);
        glowGrad.addColorStop(0, 'rgba(88,101,242,0.6)'); glowGrad.addColorStop(1, 'rgba(114,137,218,0.6)');
        ctx.fillStyle = glowGrad; this.roundRectPath(ctx, artX, artY, artSize, artSize, 16); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.lineWidth = 2; ctx.strokeStyle = tokens['accent.primary'] || '#5865F2';
        this.roundRectPath(ctx, artX, artY, artSize, artSize, 16); ctx.stroke(); ctx.clip();

        if (data.albumArt) {
            try { const img = await this.loadImage(data.albumArt); ctx.drawImage(img, artX, artY, artSize, artSize); }
            catch { ctx.fillStyle = '#2B2D31'; ctx.fillRect(artX, artY, artSize, artSize); }
        } else { ctx.fillStyle = '#2B2D31'; ctx.fillRect(artX, artY, artSize, artSize); }

        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(artX, artY, artSize, artSize);

        const btnSize = 48; const btnX = artX + (artSize - btnSize) / 2; const btnY = artY + (artSize - btnSize) / 2;
        ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
        ctx.beginPath(); ctx.arc(btnX + btnSize / 2, btnY + btnSize / 2, btnSize / 2, 0, Math.PI * 2); ctx.fill();
        drawIcon(ctx, btnX + btnSize / 2, btnY + btnSize / 2, 24, data.isPlaying ? 'pause' : 'play', '#FFFFFF', v => v);
        ctx.restore();

        // Info section
        const infoX = artX + artSize + 24;
        const infoW = width - infoX - pad;
        let curY = artY;

        ctx.font = `${getFontWeight('bold')} 24px Inter, sans-serif`;
        ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(data.trackName || 'Unknown Title', infoX, curY);
        curY += 32;

        ctx.font = `${getFontWeight('normal')} 16px Inter, sans-serif`;
        ctx.fillStyle = '#9CA3AF';
        ctx.fillText(data.artist || 'Unknown Artist', infoX, curY);
        curY += 32;

        // Progress bar
        const barH = 8; const barY = curY + 10;
        ctx.fillStyle = tokens['surface.secondary'] || '#1E1F22';
        this.roundRectPath(ctx, infoX, barY, infoW, barH, barH / 2); ctx.fill();

        const duration = data.duration || 180;
        let current = data.currentTime || 0;
        if (data.isPlaying && data.startTime) current = Math.min((Date.now() - data.startTime) / 1000, duration);
        const progress = Math.min(Math.max(current / duration, 0), 1);
        const fillW = infoW * progress;

        if (fillW > 0) {
            const pGrad = ctx.createLinearGradient(infoX, 0, infoX + fillW, 0);
            pGrad.addColorStop(0, '#5865F2'); pGrad.addColorStop(1, '#7289DA');
            ctx.fillStyle = pGrad;
            ctx.save(); ctx.shadowColor = 'rgba(88,101,242,0.5)'; ctx.shadowBlur = 20;
            this.roundRectPath(ctx, infoX, barY, fillW, barH, barH / 2); ctx.fill(); ctx.restore();
        }

        const fmtTime = s => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
        const timeY = barY + barH + 8;
        ctx.font = `${getFontWeight('normal')} 12px Inter, sans-serif`; ctx.fillStyle = '#9CA3AF';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(fmtTime(current), infoX, timeY);
        ctx.textAlign = 'right'; ctx.fillText(fmtTime(duration), infoX + infoW, timeY);

        // Controls
        const ctrlY = timeY + 24 + 10; const iconSize = 20;
        const btnSizeS = 32;
        drawIcon(ctx, infoX + btnSizeS / 2, ctrlY + btnSizeS / 2, iconSize, 'prev', '#9CA3AF', v => v);

        const playBtnSize = 40; const playBtnX = infoX + btnSizeS + 12;
        ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
        this.roundRectPath(ctx, playBtnX, ctrlY - 4, playBtnSize, playBtnSize, 12); ctx.fill();
        drawIcon(ctx, playBtnX + playBtnSize / 2, ctrlY - 4 + playBtnSize / 2, 20, data.isPlaying ? 'pause' : 'play', '#FFFFFF', v => v);

        const nextBtnX = playBtnX + playBtnSize + 12;
        drawIcon(ctx, nextBtnX + btnSizeS / 2, ctrlY + btnSizeS / 2, iconSize, 'next', '#9CA3AF', v => v);

        const volW = 80; const volH = 4;
        const volX = width - pad - volW; const volY = ctrlY + btnSizeS / 2 - volH / 2;
        drawIcon(ctx, volX - 20, volY + volH / 2, 16, 'volume', '#9CA3AF', v => v);
        ctx.fillStyle = '#1E1F22'; this.roundRectPath(ctx, volX, volY, volW, volH, volH / 2); ctx.fill();
        ctx.fillStyle = '#5865F2';
        this.roundRectPath(ctx, volX, volY, volW * (data.volume !== undefined ? data.volume : 0.75), volH, volH / 2); ctx.fill();

        const shufX = volX - 60; drawIcon(ctx, shufX, ctrlY + btnSizeS / 2, 16, 'shuffle', '#9CA3AF', v => v);
        const repX = shufX - 32;
        ctx.fillStyle = 'rgba(88,101,242,0.2)';
        this.roundRectPath(ctx, repX - 12, ctrlY + btnSizeS / 2 - 12, 24, 24, 8); ctx.fill();
        drawIcon(ctx, repX, ctrlY + btnSizeS / 2, 16, 'repeat', '#5865F2', v => v);
    }
}

module.exports = { MusicCardRenderer };
