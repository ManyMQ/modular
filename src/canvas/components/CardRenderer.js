/**
 * CardRenderer Component
 * Reversible-engineered from screenshot analysis
 * Supports 4 card types × 10 visual themes
 */

const { BaseComponent } = require('./BaseComponent');
const { roundRect, createLinearGradient, setShadow, clearShadow, clipRoundRect } = require('../utils/canvas');
const { lighten, darken, setAlpha } = require('../utils/color');
const { themeToTokens } = require('../themes/index');

class CardRenderer extends BaseComponent {
  constructor(options = {}) {
    super('card-renderer', options);
    this.cardType = options.cardType || 'rank'; // rank | music | leaderboard | invite
    this.theme = options.theme || 'discord';
    this.data = options.data || {};
  }

  /**
   * Override scale to prevent double scaling since CanvasRenderer scales the context
   * @param {number} value
   * @returns {number}
   */
  scale(value) {
    return value;
  }

  async _render(ctx, bounds, styleEngine, tokens) {
    const { width, height } = bounds;

    // Render card background
    await this._renderCardBackground(ctx, width, height, tokens);

    // Render theme-specific decorative elements (behind content)
    await this._renderThemeDecorations(ctx, width, height, tokens, 'background');

    // Render card type specific content
    switch (this.cardType) {
      case 'rank':
        await this._renderRankCard(ctx, width, height, tokens, this.data);
        break;
      case 'music':
        await this._renderMusicCard(ctx, width, height, tokens, this.data);
        break;
      case 'leaderboard':
        await this._renderLeaderboardCard(ctx, width, height, tokens, this.data);
        break;
      case 'invite':
        await this._renderInviteCard(ctx, width, height, tokens, this.data);
        break;
      case 'profile':
        await this._renderProfileCard(ctx, width, height, tokens, this.data);
        break;
      case 'welcome':
        await this._renderWelcomeCard(ctx, width, height, tokens, this.data);
        break;
    }

    // Render theme-specific decorative elements (foreground)
    await this._renderThemeDecorations(ctx, width, height, tokens, 'foreground');
  }

  /**
   * Safe token retrieval with fallback
   * @param {Object} tokens - Token object
   * @param {string} key - Token key
   * @param {*} [fallback] - Fallback value
   * @returns {*}
   */
  _getToken(tokens, key, fallback) {
    if (tokens && tokens[key] !== undefined) {
      return tokens[key];
    }
    return fallback;
  }

  _getTokensForTheme(themeName) {
    try {
      return themeToTokens(themeName);
    } catch {
      return themeToTokens('discord'); // Safe fallback
    }
  }

  /**
   * Set color alpha
   * @param {string} color - Hex or RGB color
   * @param {number} alpha - Alpha value (0-1)
   * @returns {string}
   */
  _setAlpha(color, alpha) {
    return setAlpha(color, alpha);
  }

  async _renderCardBackground(ctx, width, height, tokens) {
    const radius = this.scale(tokens['radius.card'] || 16);
    const bgColor = tokens['surface.primary'] || '#1a1b26';

    // Base card shape
    ctx.save();
    this.roundRectPath(ctx, 0, 0, width, height, radius);
    ctx.clip();

    // Background fill
    if (bgColor.startsWith('rgba')) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Glassmorphism blur overlay (if applicable)
    if (tokens['effect.glassmorphism'] || tokens['effect.backdropBlur']) {
      await this._renderGlassEffect(ctx, width, height);
    }

    // Grid background (for Sci-Fi themes)
    if (tokens['effect.gridBackground']) {
      this._drawGrid(ctx, width, height, tokens['accent.primary'], 0.15);
    }

    // Scanlines effect
    if (tokens['effect.scanlines']) {
      this._drawScanlines(ctx, width, height, 'rgba(255, 255, 255, 0.05)');
    }

    ctx.restore();

    // Border/glow effect
    const glowStrength = tokens['glow.strength'];
    if (glowStrength > 0 || tokens['effect.gradientBorder']) {
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(glowStrength),
        offsetX: 0,
        offsetY: 0
      });

      if (tokens['effect.gradientBorder']) {
        const borderGrad = createLinearGradient(
          ctx, 0, 0, width, height,
          [
            { pos: 0, color: tokens['accent.primary'] },
            { pos: 1, color: tokens['accent.secondary'] }
          ]
        );
        ctx.strokeStyle = borderGrad;
      } else {
        ctx.strokeStyle = tokens['accent.primary'];
      }

      ctx.lineWidth = this.scale(tokens['border.width'] || 1.5);
      this.roundRectPath(ctx, 0, 0, width, height, radius);
      ctx.stroke();
      clearShadow(ctx);
    }
  }

  async _renderGlassEffect(ctx, width, height) {
    // Inner gradient for glassmorphism depth
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  async _renderThemeDecorations(ctx, width, height, tokens, layer = 'background') {
    if (layer === 'background') {
      // Background layer decorations
      if (tokens['effect.particles']) {
        this._renderParticles(ctx, width, height, tokens);
      }
    } else {
      // Foreground layer decorations
      if (tokens['effect.cornerBrackets']) {
        this._renderCornerBrackets(ctx, width, height, tokens);
      }

      if (tokens['effect.neonBorders']) {
        this._renderNeonBorders(ctx, width, height, tokens);
      }

      if (tokens['effect.scanlines']) {
        this._renderMatrixScanlines(ctx, width, height, tokens);
      }

      if (tokens['effect.techDeco']) {
        this._renderTechDeco(ctx, width, height, tokens);
      }
    }
  }

  _renderTechDeco(ctx, width, height, tokens) {
    ctx.save();
    const color = tokens['accent.secondary'] || '#38EF7D';
    const subColor = tokens['accent.primary'] || '#11998E';

    // Top/Bottom gradient lines
    const barH = this.scale(4);
    const topGrad = createLinearGradient(ctx, 0, 0, width, 0, [
      { pos: 0, color: subColor },
      { pos: 1, color: color }
    ]);
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, barH);
    ctx.fillRect(0, height - barH, width, barH);

    // Corner Accents (Angled)
    const size = this.scale(30);
    const thick = this.scale(3);
    ctx.strokeStyle = color;
    ctx.lineWidth = thick;

    // Top Right
    ctx.beginPath();
    ctx.moveTo(width - size, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, size);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(0, height - size);
    ctx.lineTo(0, height);
    ctx.lineTo(size, height);
    ctx.stroke();

    ctx.restore();
  }

  _renderParticles(ctx, width, height, tokens) {
    ctx.save();
    const count = 50;
    const color = '#FFFFFF';

    // Seeded random for consistency? No, but let's just draw some dots.
    // For a real engine we'd use a seed, but here we'll just mock it.
    for (let i = 0; i < count; i++) {
      const x = (i * 137.5) % width;
      const y = (i * 258.1) % height;
      const size = (i % 3) + 0.5;
      const alpha = 0.2 + (i % 5) * 0.1;

      ctx.fillStyle = setAlpha(color, alpha);
      ctx.beginPath();
      ctx.arc(x, y, this.scale(size), 0, Math.PI * 2);
      ctx.fill();

      // Add a tiny glow to some stars
      if (i % 10 === 0) {
        ctx.fillStyle = setAlpha(tokens['accent.primary'], alpha * 0.5);
        ctx.beginPath();
        ctx.arc(x, y, this.scale(size * 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  _renderNeonBorders(ctx, width, height, tokens) {
    ctx.save();
    const radius = this.scale(tokens['radius.card']);
    const color = tokens['accent.primary'];
    const weight = this.scale(tokens['border.width'] || 2.5);

    // Multiple layers for neon glow effect
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = setAlpha(color, 0.3 - (i * 0.1));
      ctx.lineWidth = weight + this.scale(i * 4);
      this.roundRectPath(ctx, 0, 0, width, height, radius);
      ctx.stroke();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    this.roundRectPath(ctx, 0, 0, width, height, radius);
    ctx.stroke();
    ctx.restore();
  }

  _renderMatrixScanlines(ctx, width, height, tokens) {
    ctx.save();
    ctx.strokeStyle = setAlpha(tokens['accent.primary'], 0.05);
    ctx.lineWidth = this.scale(1);
    for (let i = 0; i < height; i += this.scale(4)) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    ctx.restore();
  }

  _renderStatusBadge(ctx, x, y, text, tokens) {
    ctx.save();
    const padH = this.scale(12);

    ctx.font = `${this.getFontWeight('bold')} ${this.scale(9)}px Inter, sans-serif`;
    const textWidth = ctx.measureText(text).width;
    const w = textWidth + padH * 2;
    const h = this.scale(18);

    const bx = x - w / 2;
    const by = y;

    // Pulse dot
    const dotSize = this.scale(4);
    ctx.fillStyle = tokens['status.online'] || tokens['accent.primary'];
    ctx.beginPath();
    ctx.arc(bx + padH - dotSize * 1.5, by + h / 2, dotSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = tokens['text.primary'];
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + padH, by + h / 2);

    ctx.restore();
  }

  _renderCornerBrackets(ctx, width, height, tokens) {
    const bracketSize = this.scale(20);
    const bracketThickness = this.scale(2);
    const offset = this.scale(4);
    const color = tokens['accent.primary'];

    ctx.strokeStyle = color;
    ctx.lineWidth = bracketThickness;
    ctx.lineCap = 'square';

    // Top-left
    ctx.beginPath();
    ctx.moveTo(offset + bracketSize, offset);
    ctx.lineTo(offset, offset);
    ctx.lineTo(offset, offset + bracketSize);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - offset - bracketSize, offset);
    ctx.lineTo(width - offset, offset);
    ctx.lineTo(width - offset, offset + bracketSize);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(offset, height - offset - bracketSize);
    ctx.lineTo(offset, height - offset);
    ctx.lineTo(offset + bracketSize, height - offset);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - offset - bracketSize, height - offset);
    ctx.lineTo(width - offset, height - offset);
    ctx.lineTo(width - offset, height - offset - bracketSize);
    ctx.stroke();
  }

  _renderGlowOverlay(ctx, width, height, tokens) {
    // Subtle glow gradient from edges
    const glowSize = this.scale(60);
    const color = setAlpha(tokens['accent.primary'], 0.15);

    // Top edge glow
    const topGrad = ctx.createLinearGradient(0, 0, 0, glowSize);
    topGrad.addColorStop(0, color);
    topGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, glowSize);
  }

  async _renderRankCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'] || 24;
    const x = this.scale(pad);
    const y = this.scale(pad);

    // --- Tokens & Data ---
    const accentColor = tokens['rank.color.accent'] || tokens['accent.primary'] || tokens['accent.primary'] || '#5865F2';
    const accentSecondary = tokens['accent.secondary'] || accentColor;
    const statsColor = tokens['rank.color.stats'] || tokens['text.primary'] || '#FFFFFF';
    const mutedColor = tokens['rank.color.muted'] || tokens['text.muted'] || '#9CA3AF';
    const labelColor = tokens['rank.color.label'] || tokens['text.muted'] || '#9CA3AF';

    const labels = {
      rank: 'Rank',
      level: 'Level',
      xp: 'Experience',
      ...(data.labels || {})
    };

    // --- Dimensions (Scaled Up) ---
    const avatarSize = this.scale(180);
    const progressHeight = this.scale(22);

    // --- Layout ---
    const avatarX = x + this.scale(10);
    const avatarY = (height - avatarSize) / 2 - this.scale(15);

    // Avatar Glow
    ctx.save();
    ctx.filter = `blur(${this.scale(20)}px)`;
    ctx.fillStyle = this._setAlpha(accentColor, 0.4);
    ctx.beginPath();
    const avatarShape = tokens['avatar.shape'] || 'circle';
    if (avatarShape === 'hexagon') {
      this._drawHexagon(ctx, avatarX, avatarY, avatarSize, 0);
    } else if (avatarShape === 'polygon-clip') {
      this._drawPolygonClip(ctx, avatarX, avatarY, avatarSize);
    } else {
      this.roundRectPath(ctx, avatarX, avatarY, avatarSize, avatarSize, this.scale(tokens['rank.radius.avatar'] || 16));
    }
    ctx.fill();
    ctx.restore();

    // Render Avatar with Border
    ctx.save();
    const borderSize = this.scale(3);
    ctx.fillStyle = accentColor;
    if (avatarShape === 'hexagon') {
      this._drawHexagon(ctx, avatarX - borderSize, avatarY - borderSize, avatarSize + borderSize * 2, 0);
    } else if (avatarShape === 'polygon-clip') {
      this._drawPolygonClip(ctx, avatarX - borderSize, avatarY - borderSize, avatarSize + borderSize * 2);
    } else {
      this.roundRectPath(ctx, avatarX - borderSize, avatarY - borderSize, avatarSize + borderSize * 2, avatarSize + borderSize * 2, this.scale(tokens['rank.radius.avatar'] + 4 || 20));
    }
    ctx.fill();

    await this._renderAvatar(ctx, avatarX, avatarY, avatarSize, data.avatar, tokens, true);
    ctx.restore();

    // Avatar Level Badge
    // Only render if theme doesn't use a circular level indicator
    if (!tokens['effect.levelCircle']) {
      const badgeSize = this.scale(48);
      let badgeX, badgeY;

      if (tokens['effect.overlapLevelBadge']) {
        // Overlap avatar (bottom right of avatar)
        badgeX = avatarX + avatarSize - badgeSize * 0.8;
        badgeY = avatarY + avatarSize - badgeSize * 0.8;
      } else {
        // Standard discord position
        badgeX = avatarX + avatarSize - badgeSize * 0.55;
        badgeY = avatarY + avatarSize - badgeSize * 0.55;
      }

      ctx.save();
      ctx.fillStyle = tokens['surface.elevated'] || tokens['surface.secondary'] || '#1E1F22';
      this.roundRectPath(ctx, badgeX - this.scale(3), badgeY - this.scale(3), badgeSize + this.scale(6), badgeSize + this.scale(6), this.scale((tokens['rank.radius.badge'] || 10) + 2 || 12));
      ctx.fill();

      const badgeGrad = createLinearGradient(
        ctx, badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize,
        [
          { pos: 0, color: accentColor },
          { pos: 1, color: tokens['effect.gradientProgress'] ? accentSecondary : accentColor }
        ]
      );
      ctx.fillStyle = badgeGrad;
      this.roundRectPath(ctx, badgeX, badgeY, badgeSize, badgeSize, this.scale(tokens['rank.radius.badge'] || 10));
      ctx.fill();

      ctx.font = `${this.getFontWeight('bold')} ${this.scale(tokens['rank.font.size.badge'] || 18)}px Inter, sans-serif`;
      ctx.fillStyle = tokens['text.primary'] || '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(data.level || 0), badgeX + badgeSize / 2, badgeY + badgeSize / 2);
      ctx.restore();
    }

    // Circular level indicator (neon-tech and themes with effect.levelCircle)
    if (tokens['effect.levelCircle']) {
      const levelBoxW = this.scale(80);
      // Position on the right side where level box usually is, but as a circle
      const levelBoxX = width - x - levelBoxW - this.scale(10);
      const levelBoxY = avatarY + (avatarSize - levelBoxW) / 2;

      ctx.save();
      // Draw background circle
      ctx.beginPath();
      ctx.arc(levelBoxX + levelBoxW / 2, levelBoxY + levelBoxW / 2, levelBoxW / 2, 0, Math.PI * 2);
      ctx.lineWidth = this.scale(4);
      ctx.strokeStyle = tokens['surface.tertiary'] || '#111';
      ctx.stroke();

      // Draw progress arc
      const progress = Math.min((data.xp || 0) / (data.maxXp || 1000), 1);
      ctx.beginPath();
      ctx.arc(levelBoxX + levelBoxW / 2, levelBoxY + levelBoxW / 2, levelBoxW / 2, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
      ctx.strokeStyle = tokens['accent.primary'] || '#00f0ff';
      ctx.lineWidth = this.scale(4); // Use line width for arc
      ctx.shadowColor = tokens['accent.glow'];
      ctx.shadowBlur = this.scale(10);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Level Text
      ctx.fillStyle = tokens['accent.secondary'] || '#ff00ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = `${this.getFontWeight('bold')} ${this.scale(10)}px Orbitron, sans-serif`;
      ctx.fillText('LVL', levelBoxX + levelBoxW / 2, levelBoxY + levelBoxW / 2 - this.scale(2));

      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'top';
      ctx.font = `${this.getFontWeight('bold')} ${this.scale(24)}px Orbitron, sans-serif`;
      ctx.fillText(String(data.level || 0), levelBoxX + levelBoxW / 2, levelBoxY + levelBoxW / 2 + this.scale(2));

      ctx.restore();
    }

    // --- Info Section ---
    const infoX = avatarX + avatarSize + this.scale(32);
    let curY = avatarY + this.scale(4);

    // 1. Username + Tag
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const nameSize = this.scale(tokens['rank.font.size.name'] || 52);
    ctx.font = `${this.getFontWeight('bold')} ${nameSize}px Inter, sans-serif`;
    ctx.fillStyle = statsColor;
    const name = data.username || 'User';
    ctx.fillText(name, infoX, curY);

    const nameW = ctx.measureText(name).width;
    // Fix tag duplication
    const displayTag = data.discriminator && data.discriminator !== '0' && data.discriminator !== '0000'
      ? `#${data.discriminator}`
      : (data.tag && data.tag !== data.username ? data.tag : '');

    if (displayTag) {
      ctx.font = `${this.getFontWeight('normal')} ${this.scale(26)}px Inter, sans-serif`;
      ctx.fillStyle = mutedColor;
      ctx.fillText(displayTag, infoX + nameW + this.scale(14), curY + this.scale(20));
    }

    // 2. Stats Row (Rank, Messages, Voice)
    curY += this.scale(68);

    ctx.font = `${this.getFontWeight('semibold')} ${this.scale(tokens['rank.font.size.labels'] || 24)}px Inter, sans-serif`;
    ctx.fillStyle = statsColor;
    ctx.fillText(labels.rank, infoX, curY);

    const labelW = ctx.measureText(labels.rank).width;
    ctx.fillStyle = accentColor;
    ctx.fillText(`#${data.rank || 1}`, infoX + labelW + this.scale(10), curY);

    // Pull stats closer together to avoid hitting the level box
    let statsOffset = infoX + this.scale(180);

    if (data.showMessages !== false && data.messages !== undefined) {
      this._drawIcon(ctx, statsOffset, curY + this.scale(14), this.scale(24), 'users', mutedColor);
      ctx.font = `${this.getFontWeight('medium')} ${this.scale(tokens['rank.font.size.stats'] || 22)}px Inter, sans-serif`;
      ctx.fillStyle = statsColor;
      ctx.fillText(`${data.messages.toLocaleString()} msgs`, statsOffset + this.scale(36), curY + this.scale(2));
      statsOffset += this.scale(165);
    }

    if (data.showVoice !== false && data.voiceTime !== undefined) {
      this._drawIcon(ctx, statsOffset, curY + this.scale(14), this.scale(24), 'volume', mutedColor);
      ctx.font = `${this.getFontWeight('medium')} ${this.scale(tokens['rank.font.size.stats'] || 22)}px Inter, sans-serif`;
      ctx.fillStyle = statsColor;
      const hours = Math.floor(data.voiceTime / 3600);
      ctx.fillText(`${hours}h voice`, statsOffset + this.scale(36), curY + this.scale(2));
    }

    // 3. Level Box (Only if not overlapping)
    if (!tokens['effect.overlapLevelBadge']) {
      const levelBoxW = this.scale(150);
      const levelBoxH = this.scale(70);
      const levelBoxX = width - x - levelBoxW - this.scale(5);
      const levelBoxY = avatarY + this.scale(8);

      ctx.save();
      ctx.fillStyle = this._setAlpha(accentColor, 0.2);
      ctx.strokeStyle = this._setAlpha(accentColor, 0.4);
      ctx.lineWidth = this.scale(2.5);
      this.roundRectPath(ctx, levelBoxX, levelBoxY, levelBoxW, levelBoxH, this.scale(tokens['rank.radius.levelBox'] || 18));
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${this.getFontWeight('bold')} ${this.scale(tokens['rank.font.size.level'] || 28)}px Inter, sans-serif`;
      ctx.fillStyle = accentColor;
      ctx.fillText(`${labels.level} ${data.level || 0}`, levelBoxX + levelBoxW / 2, levelBoxY + levelBoxH / 2);
      ctx.restore();
    }

    // 4. Progress Section (More breathing room)
    const barW = width - infoX - x - this.scale(15);
    const barY = height - y - progressHeight - this.scale(10);
    const labelY = barY - this.scale(22);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(tokens['rank.font.size.stats'] || 22)}px Inter, sans-serif`;
    ctx.fillStyle = labelColor;
    ctx.fillText(labels.xp, infoX, labelY);

    ctx.textAlign = 'right';
    ctx.fillStyle = statsColor;
    ctx.font = `${this.getFontWeight('semibold')} ${this.scale(tokens['rank.font.size.stats'] || 22)}px Inter, sans-serif`;
    const xpStr = `${(data.xp || 0).toLocaleString()} / ${(data.maxXp || 1000).toLocaleString()}`;
    ctx.fillText(xpStr, infoX + barW, labelY);

    ctx.fillStyle = tokens['surface.secondary'] || '#1E1F22';
    this.roundRectPath(ctx, infoX, barY, barW, progressHeight, progressHeight / 2);
    ctx.fill();

    const progress = Math.min((data.xp || 0) / (data.maxXp || 1000), 1);
    const fillW = barW * progress;
    if (fillW > 0) {
      const grad = ctx.createLinearGradient(infoX, 0, infoX + fillW, 0);
      grad.addColorStop(0, accentColor);
      grad.addColorStop(1, tokens['effect.gradientProgress'] ? accentSecondary : this._setAlpha(accentColor, 0.8));

      ctx.save();
      ctx.shadowColor = this._setAlpha(accentColor, 0.6);
      ctx.shadowBlur = this.scale(20);
      ctx.fillStyle = grad;
      this.roundRectPath(ctx, infoX, barY, fillW, progressHeight, progressHeight / 2);
      ctx.fill();
      ctx.restore();
    }
  }

  async _renderMusicCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'] || 24;
    const x = this.scale(pad);
    const y = this.scale(pad);

    // --- Background Effects ---
    // 1. Gradient Fade (Top Left)
    const grad = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
    grad.addColorStop(0, 'rgba(88, 101, 242, 0.1)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Blur Circle (Bottom Right)
    const blurSize = this.scale(256);
    const blurX = width + this.scale(20);
    const blurY = height + this.scale(20);

    ctx.save();
    ctx.filter = `blur(${this.scale(60)}px)`;
    ctx.fillStyle = 'rgba(88, 101, 242, 0.2)';
    ctx.beginPath();
    ctx.arc(blurX, blurY, blurSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- Content Layout ---
    // Flex container: [Album Art] [Info Section]

    // 1. Album Art (Vertically centered)
    const artSize = this.scale(128); // w-32 = 128px
    const contentH = height - y * 2;
    const artY = y + (contentH - artSize) / 2;
    const artX = x;

    // Glow behind art
    ctx.save();
    ctx.filter = `blur(${this.scale(24)}px)`;
    const glowGrad = ctx.createLinearGradient(artX, artY, artX + artSize, artY + artSize);
    glowGrad.addColorStop(0, 'rgba(88, 101, 242, 0.6)');
    glowGrad.addColorStop(1, 'rgba(114, 137, 218, 0.6)');
    ctx.fillStyle = glowGrad;
    this.roundRectPath(ctx, artX, artY, artSize, artSize, this.scale(16));
    ctx.fill();
    ctx.restore();

    // Draw Art
    ctx.save();
    // Border
    ctx.lineWidth = this.scale(2);
    ctx.strokeStyle = tokens['accent.primary'] || '#5865F2';
    this.roundRectPath(ctx, artX, artY, artSize, artSize, this.scale(16));
    ctx.stroke();
    // Clip and draw image
    ctx.clip();
    if (data.albumArt) {
      try {
        const img = await this.loadImage(data.albumArt);
        ctx.drawImage(img, artX, artY, artSize, artSize);
      } catch (e) {
        // Fallback
        ctx.fillStyle = '#2B2D31';
        ctx.fillRect(artX, artY, artSize, artSize);
      }
    } else {
      ctx.fillStyle = '#2B2D31';
      ctx.fillRect(artX, artY, artSize, artSize);
    }

    // Playing State Overlay
    // Show overlay always, but change icon based on state
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(artX, artY, artSize, artSize);

    // Circle Button
    const btnSize = this.scale(48); // w-12
    const btnX = artX + (artSize - btnSize) / 2;
    const btnY = artY + (artSize - btnSize) / 2;

    ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
    ctx.beginPath();
    ctx.arc(btnX + btnSize / 2, btnY + btnSize / 2, btnSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Icon (Pause if playing, Play if paused)
    this._drawIcon(ctx, btnX + btnSize / 2, btnY + btnSize / 2, this.scale(24), data.isPlaying ? 'pause' : 'play', '#FFFFFF');
    ctx.restore();

    // 2. Info Section
    const infoX = artX + artSize + this.scale(24);
    const infoW = width - infoX - this.scale(pad);

    // Vertical Stack: Title/Artist -> Progress -> Controls
    // Approximate vertical distribution or use fixed spacing

    // Row 1: Title & Artist
    let curY = artY; // Start at top of album art alignment

    // Title
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(24)}px Inter, sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(data.trackName || 'Unknown Title', infoX, curY);

    curY += this.scale(32); // Line height approx

    // Artist
    ctx.font = `${this.getFontWeight('normal')} ${this.scale(16)}px Inter, sans-serif`;
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.fillText(data.artist || 'Unknown Artist', infoX, curY);

    curY += this.scale(32); // Gap

    // Row 2: Progress Bar
    const barH = this.scale(8); // h-2
    const barY = curY + this.scale(10); // push down a bit

    // Background Track
    ctx.fillStyle = tokens['surface.secondary'] || '#1E1F22';
    this.roundRectPath(ctx, infoX, barY, infoW, barH, barH / 2);
    ctx.fill();

    // Fill
    const duration = data.duration || 180;
    let current = data.currentTime || 0;

    // Auto-calculate progress if startTime is provided and playing
    if (data.isPlaying && data.startTime) {
      const elapsed = (Date.now() - data.startTime) / 1000;
      current = Math.min(elapsed, duration);
    }

    const progress = Math.min(Math.max(current / duration, 0), 1);
    const fillW = infoW * progress;

    if (fillW > 0) {
      const pGrad = ctx.createLinearGradient(infoX, 0, infoX + fillW, 0);
      pGrad.addColorStop(0, '#5865F2');
      pGrad.addColorStop(1, '#7289DA');
      ctx.fillStyle = pGrad;

      // Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(88, 101, 242, 0.5)';
      ctx.shadowBlur = this.scale(20);
      this.roundRectPath(ctx, infoX, barY, fillW, barH, barH / 2);
      ctx.fill();
      ctx.restore();
    }

    // Time Labels
    const timeY = barY + barH + this.scale(8);
    ctx.font = `${this.getFontWeight('normal')} ${this.scale(12)}px Inter, sans-serif`;
    ctx.fillStyle = '#9CA3AF';

    // Current Time
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const fmtTime = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2, '0')}`;
    };
    ctx.fillText(fmtTime(current), infoX, timeY);

    // Total Time
    ctx.textAlign = 'right';
    ctx.fillText(fmtTime(duration), infoX + infoW, timeY);

    curY = timeY + this.scale(24); // Gap to controls

    // Row 3: Controls
    // Left Group: Prev, Play/Pause, Next
    const ctrlY = curY + this.scale(10);
    const iconSize = this.scale(20); // w-5 approx

    // Skip Back
    const btnSizeS = this.scale(32); // w-8
    this._drawIcon(ctx, infoX + btnSizeS / 2, ctrlY + btnSizeS / 2, iconSize, 'prev', '#9CA3AF');

    // Play/Pause Center
    const playBtnSize = this.scale(40); // w-10
    const playBtnX = infoX + btnSizeS + this.scale(12);
    // Draw Button BG
    ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
    this.roundRectPath(ctx, playBtnX, ctrlY - this.scale(4), playBtnSize, playBtnSize, this.scale(12));
    ctx.fill();
    // Icon
    this._drawIcon(ctx, playBtnX + playBtnSize / 2, ctrlY - this.scale(4) + playBtnSize / 2, this.scale(20), data.isPlaying ? 'pause' : 'play', '#FFFFFF');

    // Skip Forward
    const nextBtnX = playBtnX + playBtnSize + this.scale(12);
    this._drawIcon(ctx, nextBtnX + btnSizeS / 2, ctrlY + btnSizeS / 2, iconSize, 'next', '#9CA3AF');

    // Right Group: Repeat, Shuffle, Volume
    // Align right
    // Volume Bar + Icon
    const volW = this.scale(80); // w-20
    const volH = this.scale(4); // h-1
    const volX = width - this.scale(pad) - volW;
    const volY = ctrlY + btnSizeS / 2 - volH / 2;

    // Volume Icon
    this._drawIcon(ctx, volX - this.scale(20), volY + volH / 2, this.scale(16), 'volume', '#9CA3AF');

    // Bar BG
    ctx.fillStyle = '#1E1F22';
    this.roundRectPath(ctx, volX, volY, volW, volH, volH / 2);
    ctx.fill();
    // Bar Fill
    const volVal = data.volume !== undefined ? data.volume : 0.75;
    ctx.fillStyle = '#5865F2';
    this.roundRectPath(ctx, volX, volY, volW * volVal, volH, volH / 2);
    ctx.fill();

    // Shuffle/Repeat (Left of volume section)
    const shufX = volX - this.scale(60);
    this._drawIcon(ctx, shufX, ctrlY + btnSizeS / 2, this.scale(16), 'shuffle', '#9CA3AF');

    const repX = shufX - this.scale(32);
    // Active repeat style? Design says yes if active. Let's assume active for demo.
    // BG for active
    ctx.fillStyle = 'rgba(88, 101, 242, 0.2)';
    this.roundRectPath(ctx, repX - this.scale(12), ctrlY + btnSizeS / 2 - this.scale(12), this.scale(24), this.scale(24), this.scale(8));
    ctx.fill();
    this._drawIcon(ctx, repX, ctrlY + btnSizeS / 2, this.scale(16), 'repeat', '#5865F2');

  }

  async _renderLeaderboardCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'] || 24;
    const x = this.scale(pad);
    const y = this.scale(pad);

    // --- Background Effects ---
    const grad = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
    grad.addColorStop(0, 'rgba(88, 101, 242, 0.1)'); // #5865F2 @ 10%
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Header
    const headerHeight = this.scale(80);
    const titleY = y + this.scale(10);

    // Trophy Icon Box
    const iconBoxSize = this.scale(40);
    ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
    this.roundRectPath(ctx, x, titleY, iconBoxSize, iconBoxSize, this.scale(12));
    ctx.fill();
    this._drawIcon(ctx, x + iconBoxSize / 2, titleY + iconBoxSize / 2, this.scale(20), 'trophy', '#FFFFFF');

    // Title & Subtitle
    const titleX = x + iconBoxSize + this.scale(12);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.font = `${this.getFontWeight('bold')} ${this.scale(20)}px Inter, sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(data.title || 'Server Leaderboard', titleX, titleY);

    ctx.font = `${this.getFontWeight('medium')} ${this.scale(14)}px Inter, sans-serif`;
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.fillText(data.subtitle || 'Top 5 Members', titleX, titleY + this.scale(24));

    // Season Badge (Right)
    if (data.season) {
      ctx.font = `${this.getFontWeight('semibold')} ${this.scale(14)}px Inter, sans-serif`;
      const seasonW = ctx.measureText(data.season).width + this.scale(24);
      const seasonH = this.scale(32);
      const seasonX = width - this.scale(pad) - seasonW;
      const seasonY = titleY;

      ctx.fillStyle = 'rgba(88, 101, 242, 0.2)';
      ctx.strokeStyle = 'rgba(88, 101, 242, 0.5)';
      ctx.lineWidth = this.scale(1);
      this.roundRectPath(ctx, seasonX, seasonY, seasonW, seasonH, this.scale(10));
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#5865F2';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.season, seasonX + seasonW / 2, seasonY + seasonH / 2);
    }

    // List Entries
    const entries = data.entries || [];
    let curY = y + headerHeight;
    const rowH = this.scale(72);
    const gap = this.scale(12);

    for (let i = 0; i < Math.min(entries.length, 5); i++) {
      const entry = entries[i];
      const isTop3 = i < 3;
      const rank = i + 1;

      // Row BG
      const rowColor = isTop3 ? 'rgba(88, 101, 242, 0.1)' : '#1E1F22';
      const borderColor = isTop3 ? 'rgba(88, 101, 242, 0.3)' : 'transparent';

      ctx.fillStyle = rowColor;
      this.roundRectPath(ctx, x, curY, width - x * 2, rowH, this.scale(12));
      ctx.fill();

      if (isTop3) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = this.scale(1);
        ctx.stroke();
      }

      // Rank Badge
      const rSize = this.scale(32);
      const rX = x + this.scale(12);
      const rY = curY + (rowH - rSize) / 2;

      const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

      ctx.fillStyle = isTop3 ? (tokens['accent.primary'] || '#5865F2') : 'rgba(255, 255, 255, 0.05)';
      this.roundRectPath(ctx, rX, rY, rSize, rSize, this.scale(8));
      ctx.fill();

      ctx.font = `${this.getFontWeight('bold')} ${this.scale(14)}px Inter, sans-serif`;
      ctx.fillStyle = isTop3 ? rankColors[i] : '#9CA3AF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(rank), rX + rSize / 2, rY + rSize / 2);

      // Avatar
      const avSize = this.scale(48);
      const avX = rX + rSize + this.scale(16);
      const avY = curY + (rowH - avSize) / 2;

      // Avatar Ring for Top 3
      if (isTop3) {
        ctx.strokeStyle = tokens['accent.primary'] || '#5865F2';
        ctx.lineWidth = this.scale(2);
        ctx.beginPath();
        ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2 + this.scale(2), 0, Math.PI * 2);
        ctx.stroke();
      }
      await this._renderAvatar(ctx, avX, avY, avSize, entry.avatar, tokens, true); // Circle

      // Username & Level
      const nameX = avX + avSize + this.scale(16);
      const textY = curY + rowH / 2;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.font = `${this.getFontWeight('semibold')} ${this.scale(16)}px Inter, sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(entry.username || 'User', nameX, textY - this.scale(2));

      ctx.textBaseline = 'top';
      ctx.font = `${this.getFontWeight('normal')} ${this.scale(12)}px Inter, sans-serif`;
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText(`Level ${entry.level || 1}`, nameX, textY + this.scale(2));

      // Score
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const scoreX = width - this.scale(pad) - this.scale(12);

      ctx.font = `${this.getFontWeight('bold')} ${this.scale(16)}px Inter, sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText((entry.score || 0).toLocaleString(), scoreX, textY - this.scale(8));

      ctx.font = `${this.getFontWeight('bold')} ${this.scale(10)}px Inter, sans-serif`;
      ctx.fillStyle = '#5865F2';
      ctx.fillText('XP', scoreX, textY + this.scale(8));

      curY += rowH + gap;
    }
  }

  async _renderInviteCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'] || 24;
    const x = this.scale(pad);
    const y = this.scale(pad);

    // --- Background Effects ---
    const grad = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
    grad.addColorStop(0, 'rgba(88, 101, 242, 0.1)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const blurSize = this.scale(256);
    const blurX = width - this.scale(50);
    const blurY = height - this.scale(50);
    ctx.save();
    ctx.filter = `blur(${this.scale(60)}px)`;
    ctx.fillStyle = 'rgba(88, 101, 242, 0.2)';
    ctx.beginPath();
    ctx.arc(blurX, blurY, blurSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 1. Header (Avatar + Name)
    const avSize = this.scale(96);
    const avX = x;
    const avY = y;

    // Glow
    ctx.save();
    ctx.filter = `blur(${this.scale(24)}px)`;
    const glowGrad = ctx.createLinearGradient(avX, avY, avX + avSize, avY + avSize);
    glowGrad.addColorStop(0, 'rgba(88, 101, 242, 0.6)');
    glowGrad.addColorStop(1, 'rgba(114, 137, 218, 0.6)');
    ctx.fillStyle = glowGrad;
    this.roundRectPath(ctx, avX, avY, avSize, avSize, this.scale(16));
    ctx.fill();
    ctx.restore();

    // Avatar + Border
    ctx.save();
    ctx.lineWidth = this.scale(2);
    ctx.strokeStyle = '#5865F2';
    this.roundRectPath(ctx, avX, avY, avSize, avSize, this.scale(16));
    ctx.stroke();

    await this._renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens, true);
    ctx.restore();

    // Name
    const nameX = avX + avSize + this.scale(24);
    const nameY = avY + avSize / 2;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(24)}px Inter, sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(data.username || 'User', nameX, nameY - this.scale(4));

    ctx.textBaseline = 'top';
    ctx.font = `${this.getFontWeight('normal')} ${this.scale(14)}px Inter, sans-serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(data.title || 'Community Member', nameX, nameY + this.scale(4));

    // 2. Stats Grid (3 cols)
    const gridY = avY + avSize + this.scale(24);
    const gridH = this.scale(80);
    const colGap = this.scale(16);
    const totalW = width - x * 2;
    const colW = (totalW - colGap * 2) / 3;

    const stats = [
      { label: 'Total Invites', val: data.invites || 0, icon: 'users', color: '#FFFFFF' }, // Stat 1
      { label: 'Valid', val: data.valid || 0, icon: 'award', color: '#FFFFFF' },        // Stat 2
      { label: 'Rewards', val: data.rewards || 0, icon: 'gift', color: '#5865F2' }      // Stat 3
    ];

    for (let i = 0; i < 3; i++) {
      const sx = x + (colW + colGap) * i;
      const stat = stats[i];

      ctx.fillStyle = tokens['surface.secondary'] || '#1E1F22'; // BG
      this.roundRectPath(ctx, sx, gridY, colW, gridH, this.scale(12));
      ctx.fill();
      ctx.strokeStyle = 'rgba(88, 101, 242, 0.3)';
      ctx.lineWidth = this.scale(1);
      ctx.stroke();

      // Content
      const contentX = sx + this.scale(16);
      const contentY = gridY + this.scale(16);

      // Icon + Label
      this._drawIcon(ctx, contentX + this.scale(8), contentY + this.scale(8), this.scale(16), stat.icon, '#5865F2');

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = `${this.getFontWeight('normal')} ${this.scale(12)}px Inter, sans-serif`;
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText(stat.label, contentX + this.scale(24), contentY + this.scale(8));

      // Value
      ctx.font = `${this.getFontWeight('bold')} ${this.scale(24)}px Inter, sans-serif`;
      ctx.fillStyle = stat.color;
      ctx.fillText(stat.val.toLocaleString(), contentX, contentY + this.scale(36));
    }

    // 3. Progress Section
    const progY = gridY + gridH + this.scale(24);
    const progH = height - progY - y; // Use remaining space?
    // Actually fixed height roughly

    // BG
    ctx.fillStyle = setAlpha(tokens['accent.primary'] || '#5865F2', 0.1);
    this.roundRectPath(ctx, x, progY, totalW, this.scale(90), this.scale(12));
    ctx.fill();
    ctx.strokeStyle = setAlpha(tokens['accent.primary'] || '#5865F2', 0.3);
    ctx.lineWidth = this.scale(1);
    ctx.stroke();

    const px = x + this.scale(16);
    const py = progY + this.scale(16);
    const pw = totalW - this.scale(32);

    // Header text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${this.getFontWeight('normal')} ${this.scale(14)}px Inter, sans-serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('Next Milestone', px, py);

    ctx.textAlign = 'right';
    ctx.fillStyle = tokens['text.primary'] || '#FFFFFF';
    ctx.fillText(`${data.invites || 0} / ${data.milestoneMax || 250}`, px + pw, py);

    // Bar
    const barY = py + this.scale(24);
    const barH = this.scale(12);

    // Track
    ctx.fillStyle = '#1E1F22';
    this.roundRectPath(ctx, px, barY, pw, barH, barH / 2);
    ctx.fill();

    // Fill
    const progress = Math.min((data.invites || 0) / (data.milestoneMax || 250), 1);
    const fillW = pw * progress;

    if (fillW > 0) {
      const pGrad = ctx.createLinearGradient(px, 0, px + fillW, 0);
      pGrad.addColorStop(0, tokens['accent.primary'] || '#5865F2');
      pGrad.addColorStop(1, tokens['accent.secondary'] || '#7289DA');
      ctx.fillStyle = pGrad;

      ctx.save();
      ctx.shadowColor = 'rgba(88, 101, 242, 0.5)';
      ctx.shadowBlur = this.scale(20);
      this.roundRectPath(ctx, px, barY, fillW, barH, barH / 2);
      ctx.fill();
      ctx.restore();
    }

    // Footer text
    const footY = barY + barH + this.scale(12);
    this._drawIcon(ctx, px + this.scale(8), footY + this.scale(6), this.scale(16), 'target', '#5865F2');

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = tokens['accent.primary'] || '#5865F2';
    ctx.font = `${this.getFontWeight('normal')} ${this.scale(14)}px Inter, sans-serif`;

    const remaining = (data.milestoneMax || 250) - (data.invites || 0);
    const msg = remaining > 0 ? `${remaining} more invites to unlock next reward!` : 'Milestone reached!';
    ctx.fillText(msg, px + this.scale(24), footY + this.scale(6));

  }
  async _renderProfileCard(ctx, width, height, tokens, data) {
    const pad = this.scale(tokens['spacing.lg'] || 24);
    const avSize = this.scale(140);
    const avX = pad * 2;
    const avY = (height - avSize) / 2;

    // Background accent
    ctx.save();
    ctx.fillStyle = setAlpha(tokens['accent.primary'], 0.1);
    ctx.fillRect(0, 0, width * 0.3, height);
    ctx.restore();

    await this._renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens, true);

    const infoX = avX + avSize + pad * 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.font = `${this.getFontWeight('bold')} ${this.scale(42)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    ctx.fillText(data.username || 'User', infoX, height / 2 - this.scale(10));

    ctx.font = `${this.getFontWeight('medium')} ${this.scale(18)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText(data.title || 'Profile Preview', infoX, height / 2 + this.scale(30));
  }

  async _renderWelcomeCard(ctx, width, height, tokens, data) {
    const pad = this.scale(tokens['spacing.lg'] || 24);

    // Center layout for welcome
    const avSize = this.scale(120);
    const avX = (width - avSize) / 2;
    const avY = height / 2 - this.scale(80);

    await this._renderAvatar(ctx, avX, avY, avSize, data.avatar, tokens, true);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `${this.getFontWeight('bold')} ${this.scale(36)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    ctx.fillText(data.welcomeMessage || `Welcome, ${data.username || 'User'}!`, width / 2, height / 2 + this.scale(30));

    ctx.font = `${this.getFontWeight('medium')} ${this.scale(16)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText(data.subtitle || 'Glad to have you here!', width / 2, height / 2 + this.scale(70));
  }


  // ========== UTILITY RENDERERS ==========

  async _renderAvatar(ctx, x, y, size, src, tokens, withGlow = false) {
    const isCircle = tokens['avatar.shape'] === 'circle' || tokens['radius.avatar'] >= 50;
    const radius = this.scale(tokens['rank.radius.avatar'] || (isCircle ? size / 2 : 12));

    if (withGlow) {
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(tokens['glow.strength']),
        offsetX: 0,
        offsetY: 0
      });
    }

    // Avatar border
    const shape = tokens['avatar.shape'] || 'circle';

    if (shape === 'hexagon') {
      this._drawHexagon(ctx, x, y, size, radius);
    } else if (shape === 'polygon-clip') {
      this._drawPolygonClip(ctx, x, y, size);
    } else {
      // Default to rounded rect/circle
      this.roundRectPath(ctx, x, y, size, size, radius);
    }

    if (withGlow) {
      setShadow(ctx, {
        color: tokens['shadow.color'] || tokens['accent.glow'],
        blur: this.scale(tokens['shadow.blur'] || 20),
        offsetX: 0,
        offsetY: this.scale(4)
      });
      ctx.fill();
      clearShadow(ctx);
    }

    // Clip for image
    ctx.save();
    ctx.beginPath();
    if (shape === 'hexagon') {
      this._drawHexagon(ctx, x, y, size, radius);
    } else if (shape === 'polygon-clip') {
      this._drawPolygonClip(ctx, x, y, size);
    } else {
      this.roundRectPath(ctx, x, y, size, size, radius);
    }
    ctx.clip();

    // Draw image
    // In a real implementation, we would load the image here
    // For now, draw placeholder background
    ctx.fillStyle = tokens['surface.tertiary'];
    ctx.fillRect(x, y, size, size);

    // Draw image if available (mock load)
    if (src) {
      try {
        const img = await this.loadImage(src);
        ctx.drawImage(img, x, y, size, size);
      } catch (e) {
        // Placeholder
        ctx.font = `${this.getFontWeight('bold')} ${this.scale(size * 0.4)}px Inter, sans-serif`;
        ctx.fillStyle = tokens['text.muted'];
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', x + size / 2, y + size / 2);
      }
    }

    ctx.restore();

    // Border
    ctx.strokeStyle = tokens['accent.primary'] || '#5865F2';
    ctx.lineWidth = this.scale(2);
    ctx.beginPath();
    if (shape === 'hexagon') {
      this._drawHexagon(ctx, x, y, size, radius);
    } else if (shape === 'polygon-clip') {
      this._drawPolygonClip(ctx, x, y, size);
    } else {
      this.roundRectPath(ctx, x, y, size, size, radius);
    }
    ctx.stroke();
  }

  async _renderAlbumArt(ctx, x, y, size, src, tokens) {
    const radius = this.scale(tokens['radius.inner']);

    setShadow(ctx, {
      color: 'rgba(0, 0, 0, 0.3)',
      blur: this.scale((tokens['shadow.blur'] || 20) / 2),
      offsetX: 0,
      offsetY: this.scale(4)
    });

    ctx.fillStyle = tokens['surface.secondary'];
    this.roundRectPath(ctx, x, y, size, size, radius);
    ctx.fill();

    clearShadow(ctx);

    // Placeholder music icon
    ctx.strokeStyle = tokens['accent.primary'];
    ctx.lineWidth = this.scale(3);
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size * 0.25, 0, Math.PI * 2);
    ctx.stroke();
  }

  _renderLevelBadge(ctx, x, y, size, level, tokens) {
    const radius = this.scale(tokens['radius.badge'] || (size / 2 / this.scale(1)));
    const isSquare = radius < size / 2;

    ctx.save();

    // Background
    if (tokens['effect.gradientProgress']) {
      const grad = createLinearGradient(ctx, x, y, x + size, y + size, [
        { pos: 0, color: tokens['accent.primary'] },
        { pos: 1, color: tokens['accent.secondary'] }
      ]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = tokens['accent.primary'];
    }

    if (isSquare) {
      this.roundRectPath(ctx, x, y, size, size, radius);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border
    ctx.strokeStyle = tokens['surface.primary'] || '#2B2D31';
    ctx.lineWidth = this.scale(2.5);
    if (isSquare) {
      this.roundRectPath(ctx, x, y, size, size, radius);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Level text
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(size * 0.45)}px Inter, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(level), x + size / 2, y + size / 2);

    ctx.restore();
  }

  _renderLevelBox(ctx, x, y, width, height, level, tokens) {
    const radius = this.scale(tokens['radius.inner'] || 8);

    ctx.save();
    ctx.fillStyle = tokens['surface.secondary'];
    this.roundRectPath(ctx, x, y, width, height, radius);
    ctx.fill();

    ctx.strokeStyle = setAlpha(tokens['accent.primary'], 0.5);
    ctx.lineWidth = this.scale(1);
    ctx.stroke();

    // Label "LEVEL"
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(10)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL', x + width / 2, y + height / 2 - this.scale(6));

    // Level value
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(20)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    ctx.fillText(String(level), x + width / 2, y + height / 2 + this.scale(14));

    ctx.restore();
  }

  _renderProgressBar(ctx, x, y, width, height, value, max, tokens) {
    const scaledHeight = this.scale(height);
    const radius = this.scale(tokens['radius.inner'] || 4);

    // Background track
    ctx.fillStyle = tokens['surface.tertiary'];
    this.roundRectPath(ctx, x, y, width, scaledHeight, radius);
    ctx.fill();

    // Progress fill
    const progress = Math.min(value / max, 1);
    const fillWidth = width * progress;

    if (fillWidth > 0) {
      // Gradient fill
      const grad = createLinearGradient(
        ctx, x, y, x + fillWidth, y,
        [
          { pos: 0, color: tokens['accent.primary'] },
          { pos: 1, color: tokens['effect.gradientProgress'] ? tokens['accent.secondary'] : tokens['accent.primary'] }
        ]
      );

      ctx.fillStyle = grad;

      // Glow effect
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(tokens['glow.strength'] / 2),
        offsetX: 0,
        offsetY: 0
      });

      this.roundRectPath(ctx, x, y, fillWidth, scaledHeight, radius);
      ctx.fill();

      clearShadow(ctx);
    }
  }

  _renderStatBox(ctx, x, y, width, height, stat, tokens, highlight = false) {
    const radius = this.scale(tokens['radius.inner']);

    // Box background
    ctx.fillStyle = highlight ? setAlpha(tokens['accent.primary'], 0.15) : tokens['surface.secondary'];

    if (highlight) {
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(10),
        offsetX: 0,
        offsetY: 0
      });
    } else {
      setShadow(ctx, {
        color: tokens['shadow.color'],
        blur: this.scale(8),
        offsetX: 0,
        offsetY: this.scale(2)
      });
    }

    this.roundRectPath(ctx, x, y, width, height, radius);
    ctx.fill();
    clearShadow(ctx);

    // Label
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(10)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText(stat.label.toUpperCase(), x + this.scale(12), y + this.scale(20));

    // Value
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(20)}px Inter, sans-serif`;
    ctx.fillStyle = highlight ? tokens['accent.primary'] : tokens['text.primary'];
    ctx.fillText(String(stat.value), x + this.scale(12), y + this.scale(44));
  }

  _renderBadge(ctx, x, y, width, height, text, tokens) {
    const radius = this.scale(tokens['radius.pill']);

    ctx.fillStyle = setAlpha(tokens['accent.primary'], 0.2);
    this.roundRectPath(ctx, x, y, width, height, radius);
    ctx.fill();

    ctx.strokeStyle = tokens['accent.primary'];
    ctx.lineWidth = this.scale(1);
    ctx.stroke();

    ctx.font = `${this.getFontWeight('bold')} ${this.scale(11)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['accent.primary'];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  _renderPlaybackControls(ctx, centerX, y, tokens) {
    const buttonSize = this.scale(30);
    const spacing = this.scale(15);

    // Shuffle (left)
    this._renderControlButton(ctx, centerX - buttonSize * 3, y, buttonSize, 'shuffle', tokens);

    // Previous button
    this._renderControlButton(ctx, centerX - buttonSize * 1.8, y, buttonSize, 'prev', tokens);

    // Play/Pause button (center, larger)
    this._renderControlButton(ctx, centerX - buttonSize * 0.5, y - this.scale(5), this.scale(40), 'play', tokens, true);

    // Next button
    this._renderControlButton(ctx, centerX + buttonSize * 1.5, y, buttonSize, 'next', tokens);

    // Repeat (right)
    this._renderControlButton(ctx, centerX + buttonSize * 2.7, y, buttonSize, 'repeat', tokens);

    // Bottom right utils (Volume, etc)
    this._renderMusicUtils(ctx, centerX + buttonSize * 5, y, tokens);
  }

  _renderMusicUtils(ctx, x, y, tokens) {
    const iconSize = this.scale(14);
    ctx.save();

    // Repeat icon
    this._drawIcon(ctx, x, y + this.scale(8), iconSize, 'loop', tokens['text.muted']);

    // Volume icon
    this._drawIcon(ctx, x + this.scale(25), y + this.scale(8), iconSize, 'volume', tokens['text.muted']);

    // Volume level text
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(10)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText('75%', x + this.scale(45), y + this.scale(20));

    ctx.restore();
  }

  _renderControlButton(ctx, x, y, size, type, tokens, isPrimary = false) {
    const radius = size / 2;
    const cx = x + radius;
    const cy = y + radius;

    ctx.save();

    // Background
    ctx.fillStyle = isPrimary ? tokens['accent.primary'] : 'transparent';
    if (isPrimary) {
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(15),
        offsetX: 0,
        offsetY: 0
      });
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    if (!isPrimary) {
      ctx.strokeStyle = setAlpha(tokens['text.muted'], 0.3);
      ctx.lineWidth = this.scale(1);
      ctx.stroke();
    }

    clearShadow(ctx);

    // Icon
    const iconColor = isPrimary ? tokens['surface.primary'] : tokens['text.primary'];
    this._drawIcon(ctx, cx, cy, size * 0.4, type, iconColor);

    ctx.restore();
  }

  _drawIcon(ctx, cx, cy, size, type, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = this.scale(2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const s = size / 2;

    switch (type) {
      case 'play':
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.7, cy - s);
        ctx.lineTo(cx + s, cy);
        ctx.lineTo(cx - s * 0.7, cy + s);
        ctx.closePath();
        ctx.fill();
        break;
      case 'pause':
        ctx.fillRect(cx - s * 0.8, cy - s, s * 0.5, s * 2);
        ctx.fillRect(cx + s * 0.3, cy - s, s * 0.5, s * 2);
        break;
      case 'next':
        ctx.beginPath();
        ctx.moveTo(cx - s, cy - s);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx - s, cy + s);
        ctx.stroke();
        ctx.fillRect(cx + s * 0.2, cy - s, s * 0.4, s * 2);
        break;
      case 'prev':
        ctx.beginPath();
        ctx.moveTo(cx + s, cy - s);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + s, cy + s);
        ctx.stroke();
        ctx.fillRect(cx - s * 0.6, cy - s, s * 0.4, s * 2);
        break;
      case 'shuffle':
        ctx.beginPath();
        ctx.moveTo(cx - s, cy - s * 0.5);
        ctx.lineTo(cx + s, cy + s * 0.5);
        ctx.moveTo(cx - s, cy + s * 0.5);
        ctx.lineTo(cx + s, cy - s * 0.5);
        ctx.stroke();
        break;
      case 'repeat':
        ctx.beginPath();
        ctx.arc(cx, cy, s, 0, Math.PI * 1.5);
        ctx.stroke();
        break;
      case 'loop':
        ctx.strokeRect(cx - s, cy - s * 0.6, s * 2, s * 1.2);
        break;
      case 'volume':
        ctx.beginPath();
        ctx.moveTo(cx - s, cy - s * 0.3);
        ctx.lineTo(cx - s * 0.4, cy - s * 0.3);
        ctx.lineTo(cx + s * 0.3, cy - s * 0.8);
        ctx.lineTo(cx + s * 0.3, cy + s * 0.8);
        ctx.lineTo(cx - s * 0.4, cy + s * 0.3);
        ctx.lineTo(cx - s, cy + s * 0.3);
        ctx.closePath();
        ctx.fill();
        break;
      case 'trophy':
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.6, cy - s);
        ctx.lineTo(cx + s * 0.6, cy - s);
        ctx.lineTo(cx + s * 0.6, cy);
        ctx.quadraticCurveTo(cx + s * 0.6, cy + s, cx, cy + s);
        ctx.quadraticCurveTo(cx - s * 0.6, cy + s, cx - s * 0.6, cy);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(cx - s * 0.1, cy + s, s * 0.2, s * 0.5);
        ctx.fillRect(cx - s * 0.4, cy + s * 0.5, s * 0.8, s * 0.2);
        break;
      case 'users':
        // Group of 3 dots/shoulders mock
        ctx.beginPath();
        ctx.arc(cx, cy - s * 0.2, s * 0.5, 0, Math.PI * 2); // Center head
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy + s * 0.8, s * 0.8, Math.PI, 0); // Center body
        ctx.fill();
        // Side dots
        ctx.fillStyle = setAlpha(color, 0.6); // Faint sides
        ctx.beginPath();
        ctx.arc(cx - s * 0.8, cy, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + s * 0.8, cy, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'gift':
        // Box
        ctx.fillRect(cx - s * 0.8, cy - s * 0.4, s * 1.6, s * 1.4);
        ctx.fillStyle = setAlpha('#FFFFFF', 0.8); // Ribbon mock
        ctx.fillRect(cx - s * 0.1, cy - s * 0.4, s * 0.2, s * 1.4);
        ctx.fillRect(cx - s * 0.8, cy + s * 0.2, s * 1.6, s * 0.2);
        break;
      case 'award':
        // Medal
        ctx.beginPath();
        ctx.arc(cx, cy + s * 0.2, s * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.4, cy + s * 0.2);
        ctx.lineTo(cx - s * 0.6, cy - s);
        ctx.lineTo(cx + s * 0.6, cy - s);
        ctx.lineTo(cx + s * 0.4, cy + s * 0.2);
        ctx.stroke();
        break;
      case 'target':
        // Bullseye
        ctx.beginPath();
        ctx.arc(cx, cy, s, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, s * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  /**
   * Draw technical grid background
   */
  _drawGrid(ctx, width, height, color, opacity = 0.1) {
    ctx.save();
    ctx.strokeStyle = this._setAlpha(color, opacity);
    ctx.lineWidth = 1;

    const gridSize = 30;

    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draw horizontal scanlines
   */
  _drawScanlines(ctx, width, height, color) {
    ctx.save();
    ctx.fillStyle = color;
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
    ctx.restore();
  }

  _formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getFontWeight(weight) {
    const weights = {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    };
    return weights[weight] || '400';
  }

  _drawHexagon(ctx, x, y, size, radius) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      // Adjust points for rounded corners if radius > 0
      // Simplified hexagon for now
      const px = x + size / 2 + (size / 2) * Math.cos(angle);
      const py = y + size / 2 + (size / 2) * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  _drawPolygonClip(ctx, x, y, size) {
    // 8-sided polygon (octagon-like clipping for esports)
    const cut = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(x + cut, y);
    ctx.lineTo(x + size - cut, y);
    ctx.lineTo(x + size, y + cut);
    ctx.lineTo(x + size, y + size - cut);
    ctx.lineTo(x + size - cut, y + size);
    ctx.lineTo(x + cut, y + size);
    ctx.lineTo(x, y + size - cut);
    ctx.lineTo(x, y + cut);
    ctx.closePath();
  }
}

module.exports = { CardRenderer };
