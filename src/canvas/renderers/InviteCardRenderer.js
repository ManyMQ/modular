'use strict';

const { BaseComponent } = require('../components/BaseComponent');
const { setAlpha } = require('../utils/color');
const {
    renderCardBackground, renderThemeDecorations,
    renderAvatar, drawIcon, getFontWeight
} = require('./shared/effects');

class InviteCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('invite-card', options);
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

        ctx.save(); ctx.filter = `blur(60px)`; ctx.fillStyle = 'rgba(88,101,242,0.2)';
        ctx.beginPath(); ctx.arc(width - 50, height - 50, 128, 0, Math.PI * 2); ctx.fill(); ctx.restore();

        // Avatar header
        const avSize = 96; const avX = x; const avY = y;
        ctx.save(); ctx.filter = `blur(24px)`;
        const glowGrad = ctx.createLinearGradient(avX, avY, avX + avSize, avY + avSize);
        glowGrad.addColorStop(0, 'rgba(88,101,242,0.6)'); glowGrad.addColorStop(1, 'rgba(114,137,218,0.6)');
        ctx.fillStyle = glowGrad; this.roundRectPath(ctx, avX, avY, avSize, avSize, 16); ctx.fill(); ctx.restore();

        ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = '#5865F2';
        this.roundRectPath(ctx, avX, avY, avSize, avSize, 16); ctx.stroke();
        await renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens,
            v => v, (c, x, y, w, h, r) => this.roundRectPath(c, x, y, w, h, r),
            src => this.loadImage(src), getFontWeight, true);
        ctx.restore();

        const nameX = avX + avSize + 24; const nameY = avY + avSize / 2;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = `${getFontWeight('bold')} 24px Inter, sans-serif`; ctx.fillStyle = '#FFFFFF';
        ctx.fillText(data.username || 'User', nameX, nameY - 4);
        ctx.textBaseline = 'top';
        ctx.font = `${getFontWeight('normal')} 14px Inter, sans-serif`; ctx.fillStyle = '#9CA3AF';
        ctx.fillText(data.title || 'Community Member', nameX, nameY + 4);

        // Stats grid
        const gridY = avY + avSize + 24; const gridH = 80;
        const colGap = 16; const totalW = width - x * 2;
        const colW = (totalW - colGap * 2) / 3;
        const stats = [
            { label: 'Total Invites', val: data.invites || 0, icon: 'users' },
            { label: 'Valid', val: data.valid || 0, icon: 'award' },
            { label: 'Rewards', val: data.rewards || 0, icon: 'gift' }
        ];

        for (let i = 0; i < 3; i++) {
            const sx = x + (colW + colGap) * i; const stat = stats[i];
            ctx.fillStyle = tokens['surface.secondary'] || '#1E1F22';
            this.roundRectPath(ctx, sx, gridY, colW, gridH, 12); ctx.fill();
            ctx.strokeStyle = 'rgba(88,101,242,0.3)'; ctx.lineWidth = 1; ctx.stroke();

            const cX = sx + 16; const cY = gridY + 16;
            drawIcon(ctx, cX + 8, cY + 8, 16, stat.icon, '#5865F2', v => v);
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.font = `${getFontWeight('normal')} 12px Inter, sans-serif`; ctx.fillStyle = '#9CA3AF';
            ctx.fillText(stat.label, cX + 24, cY + 8);
            ctx.font = `${getFontWeight('bold')} 24px Inter, sans-serif`; ctx.fillStyle = '#FFFFFF';
            ctx.fillText(stat.val.toLocaleString(), cX, cY + 36);
        }

        // Progress section
        const progY = gridY + gridH + 24;
        const aColor = tokens['accent.primary'] || '#5865F2';
        ctx.fillStyle = setAlpha(aColor, 0.1);
        this.roundRectPath(ctx, x, progY, totalW, 90, 12); ctx.fill();
        ctx.strokeStyle = setAlpha(aColor, 0.3); ctx.lineWidth = 1; ctx.stroke();

        const px = x + 16; const py = progY + 16; const pw = totalW - 32;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = `${getFontWeight('normal')} 14px Inter, sans-serif`; ctx.fillStyle = '#9CA3AF';
        ctx.fillText('Next Milestone', px, py);
        ctx.textAlign = 'right'; ctx.fillStyle = tokens['text.primary'] || '#FFFFFF';
        ctx.fillText(`${data.invites || 0} / ${data.milestoneMax || 250}`, px + pw, py);

        const barY = py + 24; const barH = 12;
        ctx.fillStyle = '#1E1F22'; this.roundRectPath(ctx, px, barY, pw, barH, barH / 2); ctx.fill();
        const fillW = pw * Math.min((data.invites || 0) / (data.milestoneMax || 250), 1);
        if (fillW > 0) {
            const pGrad = ctx.createLinearGradient(px, 0, px + fillW, 0);
            pGrad.addColorStop(0, aColor); pGrad.addColorStop(1, tokens['accent.secondary'] || '#7289DA');
            ctx.fillStyle = pGrad;
            ctx.save(); ctx.shadowColor = 'rgba(88,101,242,0.5)'; ctx.shadowBlur = 20;
            this.roundRectPath(ctx, px, barY, fillW, barH, barH / 2); ctx.fill(); ctx.restore();
        }

        const footY = barY + barH + 12;
        drawIcon(ctx, px + 8, footY + 6, 16, 'target', '#5865F2', v => v);
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillStyle = aColor; ctx.font = `${getFontWeight('normal')} 14px Inter, sans-serif`;
        const remaining = (data.milestoneMax || 250) - (data.invites || 0);
        ctx.fillText(remaining > 0 ? `${remaining} more invites to unlock next reward!` : 'Milestone reached!', px + 24, footY + 6);
    }
}

module.exports = { InviteCardRenderer };
