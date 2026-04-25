'use strict';

const { loadImage } = require('@napi-rs/canvas');
const { BaseComponent } = require('../components/BaseComponent');
const { setAlpha } = require('../utils/color');
const {
    drawIcon
} = require('./shared/effects');
const {
    normalizeProfileCardOptions
} = require('../../core/internal/cards/profile/validation');
const {
    resolveProfilePhotoSource,
    resolveBadgeDefinitions,
    formatJoinDateLabel,
    DISCORD_STATUS_COLORS
} = require('../../core/internal/cards/profile/service');

const _imagePromiseCache = new Map();
async function loadImageCached(src) {
    if (!src) return null;
    const cached = _imagePromiseCache.get(src);
    if (cached) return cached;
    const p = loadImage(src).catch(err => {
        _imagePromiseCache.delete(src);
        throw err;
    });
    _imagePromiseCache.set(src, p);
    return p;
}

class ProfileCardRenderer extends BaseComponent {
    constructor(options = {}) {
        super('profile-card', options);
        this.data = options.data || {};
    }

    scale(value) { return value; }

    async _render(ctx, bounds, _styles, tokens) {
        const { width, height } = bounds;
        const data = this.data;
        const opts = normalizeProfileCardOptions(data);
        const scale = Math.min(width / 885, height / 303);

        // 1. Background (Custom Image + Effects)
        await this._renderAdvancedBackground(ctx, width, height, opts, tokens);

        // 2. Main Content
        await this._renderContent(ctx, width, height, tokens, opts, scale);

        // 3. Border
        if (!opts.removeBorder) {
            this._renderAdvancedBorder(ctx, width, height, opts, tokens);
        }
    }

    async _renderAdvancedBackground(ctx, width, height, opts, tokens) {
        const radius = this.scale(tokens['radius.card'] || 24);
        ctx.save();
        this.roundRectPath(ctx, 0, 0, width, height, radius);
        ctx.clip();

        // Base color
        ctx.fillStyle = tokens['surface.primary'] || '#1a1b26';
        ctx.fillRect(0, 0, width, height);

        // Custom Image
        if (opts.customBackground) {
            try {
                const img = await loadImageCached(opts.customBackground);
                ctx.save();
                
                // Brightness
                const brightness = opts.backgroundBrightness / 100;
                ctx.filter = `brightness(${brightness})`;
                
                // Blur
                let blur = opts.blur_amount;
                if (opts.moreBackgroundBlur) blur *= 3;
                if (blur > 0) {
                    // Manual blur simulation if ctx.filter blur is not supported/stable
                    // For now using filter as it's standard in napi-rs/canvas
                    ctx.filter += ` blur(${blur}px)`;
                }

                ctx.drawImage(img, 0, 0, width, height);
                ctx.restore();
            } catch (err) {
                void err;
            }
        } else if (!opts.disableProfileTheme) {
            // Fallback to parametric or theme
            this._renderParametricBackground(ctx, width, height, opts);
        }

        ctx.restore();
    }

    _renderAdvancedBorder(ctx, width, height, opts, tokens) {
        const radius = this.scale(tokens['radius.card'] || 24);
        const weight = this.scale(tokens['border.width'] || 2);
        const fallbackBorder = tokens['accent.primary'] || '#6366f1';
        const borderAlign = opts.borderAlign || 'to bottom right';
        
        ctx.save();
        if (Array.isArray(opts.borderColor) && opts.borderColor.length >= 2) {
            const grad = this._createGradient(ctx, width, height, borderAlign, opts.borderColor);
            ctx.strokeStyle = grad;
        } else if (opts.borderColor) {
            ctx.strokeStyle = Array.isArray(opts.borderColor) ? opts.borderColor[0] : opts.borderColor;
        } else {
            const secondary = tokens['accent.secondary'];
            ctx.strokeStyle = secondary
                ? this._createGradient(ctx, width, height, borderAlign, [fallbackBorder, secondary])
                : fallbackBorder;
        }

        ctx.lineWidth = weight;
        this.roundRectPath(ctx, weight / 2, weight / 2, width - weight, height - weight, radius);
        ctx.stroke();
        ctx.restore();
    }

    _createGradient(ctx, width, height, align, colors) {
        let x1 = 0, y1 = 0, x2 = width, y2 = height;
        
        if (align === 'to right') { x2 = width; y2 = 0; }
        else if (align === 'to bottom') { x2 = 0; y2 = height; }
        else if (align === 'to left') { x1 = width; x2 = 0; y2 = 0; }
        else if (align === 'to top') { y1 = height; x2 = 0; y2 = 0; }
        
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
        return grad;
    }

    async _renderContent(ctx, width, height, tokens, opts, scale) {
        const data = this.data;
        const badgeDefs = resolveBadgeDefinitions(opts.badgeIds);
        const avatarSource = resolveProfilePhotoSource(opts.profilePhotoId, data.avatar);
        
        const avatarSize = Math.max(96, Math.min(140, Math.round(120 * scale)));
        const avatarX = Math.round(40 * scale);
        const avatarY = Math.round(40 * scale);
        
        // 1. Avatar
        await this._renderAdvancedAvatar(ctx, avatarX, avatarY, avatarSize, avatarSource, opts, tokens, scale);

        // 2. Texts
        const textX = avatarX + avatarSize + Math.round(25 * scale);
        const textY = avatarY + Math.round(15 * scale);
        this._renderAdvancedTexts(ctx, textX, textY, opts, tokens, scale);

        // 3. Badges
        if (!opts.removeBadges) {
            const badgeX = width - Math.round(40 * scale);
            const badgeY = avatarY;
            await this._renderAdvancedBadges(ctx, badgeX, badgeY, badgeDefs, opts, tokens, scale);
        }

        // 4. Rank Data
        if (opts.rankData) {
            this._renderRankData(
                ctx,
                Math.round(40 * scale),
                height - Math.round(70 * scale),
                width - Math.round(80 * scale),
                opts.rankData,
                tokens,
                scale
            );
        }

        // 5. Custom Date
        const dateLabel = formatJoinDateLabel(
            opts.customDate || data.joinDate, 
            opts.joinDateOffset, 
            data.referenceDate, 
            opts.localDateType
        );
        if (dateLabel) {
            this._renderDate(ctx, width - Math.round(40 * scale), height - Math.round(40 * scale), dateLabel, tokens, scale);
        }
    }

    _renderRankData(ctx, x, y, width, rankData, tokens, scale) {
        const { currentXP = 0, requiredXP = 1000, level = 1, rank = 1, barColor } = rankData;
        const progress = Math.min(1, currentXP / requiredXP);
        const barHeight = Math.max(10, Math.round(12 * scale));
        const family = this._getFontFamily(tokens);
        const primary = tokens['text.primary'] || '#FFFFFF';
        const muted = tokens['text.muted'] || 'rgba(255,255,255,0.7)';
        const track = tokens['surface.secondary'] || setAlpha(primary, 0.08);
        const fill = barColor || tokens['accent.primary'] || '#6366f1';

        ctx.save();

        // Level & Rank Text
        ctx.font = `${this._getFontWeight(tokens, 'bold')} ${Math.round(14 * scale)}px ${family}`;
        ctx.fillStyle = setAlpha(primary, 0.9);
        ctx.textAlign = 'left';
        ctx.fillText(`LEVEL ${level}`, x, y - Math.round(10 * scale));
        
        ctx.textAlign = 'right';
        ctx.fillText(`RANK #${rank}`, x + width, y - Math.round(10 * scale));

        // Progress Bar Background
        this.roundRectPath(ctx, x, y, width, barHeight, barHeight / 2);
        ctx.fillStyle = track;
        ctx.fill();

        // Progress Bar Fill
        if (progress > 0) {
            this.roundRectPath(ctx, x, y, width * progress, barHeight, barHeight / 2);
            ctx.fillStyle = fill;
            ctx.fill();
        }

        // XP Text
        ctx.font = `${this._getFontWeight(tokens, 'medium')} ${Math.round(10 * scale)}px ${family}`;
        ctx.fillStyle = setAlpha(muted, 1);
        ctx.textAlign = 'center';
        ctx.fillText(`${currentXP} / ${requiredXP} XP`, x + width / 2, y + barHeight + Math.round(15 * scale));

        ctx.restore();
    }

    async _renderAdvancedAvatar(ctx, x, y, size, src, opts, tokens, scale) {
        ctx.save();
        const primary = tokens['text.primary'] || '#FFFFFF';
        const avatarBg = tokens['surface.tertiary'] || '#1F2435';
        
        // Shadow/Glow
        if (!opts.removeAvatarFrame) {
            ctx.shadowColor = tokens['accent.glow'] || 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = Math.round((tokens['shadow.blur'] || 15) * scale);
        }

        // Clip shape
        ctx.beginPath();
        if (opts.squareAvatar) {
            this.roundRectPath(ctx, x, y, size, size, 12);
        } else {
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        }
        ctx.clip();

        // Background
        ctx.fillStyle = avatarBg;
        ctx.fillRect(x, y, size, size);

        // Image
        if (src) {
            try {
                const image = await loadImageCached(src);
                ctx.drawImage(image, x, y, size, size);
            } catch {
                this._drawAvatarPlaceholder(ctx, x, y, size, tokens);
            }
        } else {
            this._drawAvatarPlaceholder(ctx, x, y, size, tokens);
        }
        ctx.restore();

        // Status Light
        if (opts.status !== 'offline' || opts.presenceStatus) {
            this._renderPresenceStatus(ctx, x, y, size, opts);
        }

        // Presence Status Text (Below Avatar)
        if (opts.presenceStatus) {
            ctx.save();
            ctx.font = `italic ${Math.round(12 * scale)}px ${this._getFontFamily(tokens)}`;
            ctx.fillStyle = setAlpha(primary, 0.7);
            ctx.textAlign = 'center';
            ctx.fillText(opts.presenceStatus, x + size / 2, y + size + Math.round(20 * scale));
            ctx.restore();
        }
    }

    _renderPresenceStatus(ctx, avX, avY, size, opts) {
        const statusColor = DISCORD_STATUS_COLORS[opts.status] || DISCORD_STATUS_COLORS.offline;
        const indicatorSize = 22;
        const x = avX + size - indicatorSize + 2;
        const y = avY + size - indicatorSize + 2;

        ctx.save();
        // Mask for status
        ctx.beginPath();
        ctx.arc(x + indicatorSize / 2, y + indicatorSize / 2, indicatorSize / 2 + 3, 0, Math.PI * 2);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // Indicator
        ctx.beginPath();
        ctx.arc(x + indicatorSize / 2, y + indicatorSize / 2, indicatorSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = statusColor;
        ctx.fill();
        
        // Inner detail for specific statuses (idle, dnd)
        if (opts.status === 'idle') {
            ctx.beginPath();
            ctx.arc(x + 6, y + 6, 8, 0, Math.PI * 2);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fill();
        } else if (opts.status === 'dnd') {
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(x + 4, y + indicatorSize / 2 - 2, indicatorSize - 8, 4);
        }
        
        ctx.restore();
    }

    _renderAdvancedTexts(ctx, x, y, opts, tokens, scale) {
        ctx.save();
        const family = this._getFontFamily(tokens);
        const primary = tokens['text.primary'] || '#FFFFFF';
        const muted = tokens['text.muted'] || 'rgba(255,255,255,0.7)';
        const usernameColor = opts.usernameColor || primary;
        const tagColor = opts.tagColor || muted;
        
        // Username
        ctx.font = `${this._getFontWeight(tokens, 'bold')} ${Math.round((tokens['font.size.2xl'] || 24) * 1.45 * scale)}px ${family}`;
        ctx.fillStyle = usernameColor;
        const username = opts.customUsername || this.data.username || 'Username';
        ctx.fillText(username, x, y + Math.round(30 * scale));

        // Tag
        ctx.font = `${this._getFontWeight(tokens, 'medium')} ${Math.round((tokens['font.size.xl'] || 20) * 1.15 * scale)}px ${family}`;
        ctx.fillStyle = tagColor;
        const tag = opts.customTag || this.data.tag || '@username';
        ctx.fillText(tag, x, y + Math.round(70 * scale));

        // Subtitle
        if (opts.customSubtitle) {
            ctx.font = `${this._getFontWeight(tokens, 'regular')} ${Math.round((tokens['font.size.md'] || 14) * 1.15 * scale)}px ${family}`;
            ctx.fillStyle = setAlpha(tagColor, 0.6);
            ctx.fillText(opts.customSubtitle, x, y + Math.round(100 * scale));
        }

        ctx.restore();
    }

    async _renderAdvancedBadges(ctx, x, y, badgeDefs, opts, tokens, scale) {
        const spacing = Math.round(8 * scale);
        let currentX = x;

        // Draw Row
        const drawBadge = async (badge, isCustom = false) => {
            const size = isCustom ? Math.round(46 * scale) : Math.round(24 * scale);
            currentX -= size;

            ctx.save();
            if (opts.badgesFrame) {
                const pad = Math.max(3, Math.round(4 * scale));
                this.roundRectPath(ctx, currentX - pad, y - pad, size + pad * 2, size + pad * 2, Math.round(8 * scale));
                ctx.fillStyle = tokens['surface.secondary'] || 'rgba(0,0,0,0.3)';
                ctx.fill();
            }

            if (isCustom) {
                try {
                    const img = await loadImageCached(badge);
                    ctx.drawImage(img, currentX, y, size, size);
                } catch (err) {
                    void err;
                }
            } else {
                ctx.beginPath();
                ctx.arc(currentX + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
                ctx.fillStyle = badge.isDiscord ? 'rgba(0,0,0,0.4)' : badge.bg;
                ctx.fill();
                drawIcon(ctx, currentX + size / 2, y + size / 2, size * 0.6, badge.icon, badge.fg || (tokens['text.primary'] || '#fff'), v => v);
            }
            ctx.restore();
            currentX -= spacing;
        };

        // Custom badges first
        if (opts.customBadges) {
            for (const url of opts.customBadges) {
                await drawBadge(url, true);
            }
        }

        // Discord badges second (if not overwritten)
        if (!opts.overwriteBadges) {
            for (const badge of badgeDefs) {
                await drawBadge(badge, false);
            }
        }
    }

    _renderDate(ctx, x, y, label, tokens, scale) {
        ctx.save();
        ctx.textAlign = 'right';
        ctx.font = `${this._getFontWeight(tokens, 'medium')} ${Math.round(14 * scale)}px ${this._getFontFamily(tokens)}`;
        
        // Date Pill
        const metrics = ctx.measureText(label);
        const pw = metrics.width + Math.round(20 * scale);
        const ph = Math.round(24 * scale);
        this.roundRectPath(ctx, x - pw, y - ph / 2, pw, ph, Math.round(12 * scale));
        ctx.fillStyle = tokens['surface.secondary'] || 'rgba(0,0,0,0.4)';
        ctx.fill();

        ctx.fillStyle = setAlpha(tokens['text.primary'] || '#FFFFFF', 0.85);
        ctx.fillText(label, x - Math.round(10 * scale), y + Math.round(5 * scale));
        ctx.restore();
    }

    _drawAvatarPlaceholder(ctx, x, y, size, tokens) {
        const primary = tokens['text.primary'] || '#FFFFFF';
        const muted = tokens['text.muted'] || '#9CA3AF';
        ctx.save();
        ctx.fillStyle = tokens['surface.secondary'] || setAlpha(primary, 0.06);
        ctx.fillRect(x, y, size, size);
        ctx.font = `${this._getFontWeight(tokens, 'bold')} ${Math.round(size * 0.38)}px ${this._getFontFamily(tokens)}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = String(this.data.username || this.data.customUsername || 'U').slice(0, 1).toUpperCase();
        ctx.fillStyle = setAlpha(muted, 1);
        ctx.fillText(initial, x + size / 2, y + size / 2 + 1);
        ctx.restore();
    }

    _renderParametricBackground(ctx, width, height, opts) {
        ctx.save();
        const rad = (opts.gradient_angle * Math.PI) / 180;
        const grad = ctx.createLinearGradient(0, 0, Math.cos(rad) * width, Math.sin(rad) * height);
        const c1 = opts.primary_color;
        const c2 = opts.secondary_color;
        grad.addColorStop(0, `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`);
        grad.addColorStop(1, `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    _getFontFamily(tokens) {
        return tokens['font.family'] || 'Inter, sans-serif';
    }

    _getFontWeight(tokens, key) {
        const mapKey = ({ regular: 'regular', medium: 'medium', semibold: 'semibold', bold: 'bold' }[key] || 'regular');
        const fromTheme = tokens[`font.weight.${mapKey}`];
        if (fromTheme !== undefined && fromTheme !== null) return String(fromTheme);
        return ({ regular: '400', medium: '500', semibold: '600', bold: '700' }[key] || '400');
    }
}

module.exports = { ProfileCardRenderer };
