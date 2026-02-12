/**
 * CardRenderer Component
 * Reversible-engineered from screenshot analysis
 * Supports 4 card types × 10 visual themes
 */

const { BaseComponent } = require('../base/BaseComponent');
const { roundRect, createLinearGradient, setShadow, clearShadow, clipRoundRect } = require('../../utils/canvas');
const { lighten, darken, setAlpha } = require('../../utils/color');
const { themeToTokens } = require('../../themes/CardThemes');

class CardRenderer extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.cardType = options.cardType || 'rank'; // rank | music | leaderboard | invite
    this.theme = options.theme || 'discord';
    this.data = options.data || {};
  }

  async _render(ctx, layout, styleEngine, tokenResolver) {
    const { width, height } = layout.bounds || { width: 450, height: 280 };
    const tokens = themeToTokens(this.theme);

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
    }

    // Render theme-specific decorative elements (foreground)
    await this._renderThemeDecorations(ctx, width, height, tokens, 'foreground');
  }

  _getTokensForTheme(themeName) {
    return themeToTokens(themeName);
  }

  async _renderCardBackground(ctx, width, height, tokens) {
    const radius = this.scale(tokens['radius.card']);
    const bgColor = tokens['surface.primary'];

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
    if (this.theme === 'glassmorphism') {
      await this._renderGlassEffect(ctx, width, height);
    }

    // Gradient overlay for certain themes
    if (['synthwave', 'gradientDashboard'].includes(this.theme)) {
      const grad = createLinearGradient(
        ctx,
        0, 0, width, height,
        [
          { pos: 0, color: setAlpha(tokens['accent.primary'], 0.1) },
          { pos: 1, color: setAlpha(tokens['accent.secondary'], 0.05) }
        ]
      );
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();

    // Border/glow effect
    const glowStrength = tokens['glow.strength'];
    if (glowStrength > 0) {
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(glowStrength),
        offsetX: 0,
        offsetY: 0
      });
      ctx.strokeStyle = tokens['accent.primary'];
      ctx.lineWidth = this.scale(['cyberpunk', 'holographic', 'matrix'].includes(this.theme) ? 2 : 1);
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
    } else {
      // Foreground layer decorations
      if (['cyberpunk', 'holographic', 'retroModern'].includes(this.theme)) {
        this._renderCornerBrackets(ctx, width, height, tokens);
      }

      if (['synthwave', 'matrix', 'goldLuxury'].includes(this.theme)) {
        this._renderGlowOverlay(ctx, width, height, tokens);
      }

      if (this.theme === 'matrix') {
        this._renderMatrixScanlines(ctx, width, height, tokens);
      }
    }
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
    const pad = tokens['spacing.lg'];
    const x = this.scale(pad);
    let y = this.scale(pad);

    // 1. Status Badge (Top Center)
    if (data.statusLabel) {
      this._renderStatusBadge(ctx, width / 2, y, data.statusLabel, tokens);
    } else if (this.theme === 'matrix' || this.theme === 'holographic') {
      this._renderStatusBadge(ctx, width / 2, y, 'LIVE', tokens);
    }

    y += this.scale(10); // Offset for badge

    // 2. Avatar
    const avatarSize = this.scale(90);
    const avatarX = x;
    const avatarY = y + (height - y - avatarSize) / 2 - this.scale(10);
    await this._renderAvatar(ctx, avatarX, avatarY, avatarSize, data.avatar, tokens, true);

    // 3. Level badge on avatar (Bottom right)
    const badgeSize = this.scale(36);
    this._renderLevelBadge(ctx, avatarX + avatarSize - badgeSize * 0.6, avatarY + avatarSize - badgeSize * 0.6, badgeSize, data.level || 1, tokens);

    // 4. User info section
    const infoX = avatarX + avatarSize + this.scale(pad * 1.5);
    const infoCenterY = avatarY + avatarSize / 2;

    // Username
    ctx.textAlign = 'left';
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(26)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    const maxNameWidth = width - infoX - this.scale(pad * 2);
    ctx.fillText(data.username || 'User', infoX, infoCenterY - this.scale(2), maxNameWidth);

    // Rank info
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(14)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['accent.primary'];
    ctx.fillText(`RANK #${data.rank || '--'}`, infoX, infoCenterY + this.scale(22));

    // Level box (top-right corner)
    const levelBoxW = this.scale(80);
    const levelBoxH = this.scale(50);
    const levelBoxX = width - this.scale(pad) - levelBoxW;
    const levelBoxY = y + this.scale(10);
    this._renderLevelBox(ctx, levelBoxX, levelBoxY, levelBoxW, levelBoxH, data.level || 1, tokens);

    // 5. Progress bar (Bottom area)
    const progressPad = this.scale(pad);
    const progressX = infoX;
    const progressWidth = width - infoX - progressPad;
    const progressY = avatarY + avatarSize - this.scale(10);

    // XP Labels (Muted text above bar)
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(11)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText('XP', progressX, progressY - this.scale(8));

    const xpText = `${(data.xp || 0).toLocaleString()} / ${(data.maxXp || 1000).toLocaleString()} XP`;
    const xpPercent = Math.round(((data.xp || 0) / (data.maxXp || 1000)) * 100);

    ctx.textAlign = 'right';
    ctx.fillText(`${xpPercent}%`, progressX + progressWidth, progressY - this.scale(8));

    this._renderProgressBar(ctx, progressX, progressY, progressWidth, tokens['progress.height'], data.xp || 0, data.maxXp || 1000, tokens);

    // XP Numbers (Small muted text below bar)
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(10)}px Inter, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText((data.xp || 0).toLocaleString(), progressX, progressY + this.scale(18));
    ctx.textAlign = 'right';
    ctx.fillText((data.maxXp || 1000).toLocaleString(), progressX + progressWidth, progressY + this.scale(18));
    ctx.textAlign = 'left';
  }

  async _renderMusicCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'];
    const x = this.scale(pad);
    const y = this.scale(pad);

    // Album art
    const artSize = this.scale(100);
    await this._renderAlbumArt(ctx, x, y + this.scale(20), artSize, data.albumArt, tokens);

    // Song info
    const infoX = x + artSize + this.scale(pad);
    const infoY = y + this.scale(30);

    // Now playing label
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(11)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['accent.primary'];
    ctx.fillText('NOW PLAYING', infoX, infoY);

    // Song title
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(22)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    ctx.fillText(data.title || 'Unknown', infoX, infoY + this.scale(28));

    // Artist
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(14)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.secondary'];
    ctx.fillText(data.artist || 'Unknown Artist', infoX, infoY + this.scale(50));

    // Progress bar with time labels
    const progressY = infoY + this.scale(75);
    const progressWidth = width - infoX - this.scale(pad);
    this._renderProgressBar(ctx, infoX, progressY, progressWidth, tokens['progress.height'], data.currentTime || 0, data.duration || 100, tokens);

    // Time labels
    ctx.font = `${this.getFontWeight('regular')} ${this.scale(11)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText(this._formatTime(data.currentTime || 0), infoX, progressY + this.scale(20));
    ctx.fillText(this._formatTime(data.duration || 0), width - this.scale(pad) - this.scale(30), progressY + this.scale(20));

    // Playback controls (centered on card)
    const controlsY = height - this.scale(pad + 50);
    this._renderPlaybackControls(ctx, width / 2, controlsY, tokens);
  }

  async _renderLeaderboardCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'];
    const x = this.scale(pad);
    let y = this.scale(pad);

    // Header
    const title = data.title || 'Leaderboard';
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(20)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    ctx.fillText(title, x + this.scale(28), y + this.scale(24));

    // Trophy icon next to header
    this._drawIcon(ctx, x + this.scale(10), y + this.scale(18), this.scale(20), 'trophy', tokens['accent.primary']);

    // Subtitle
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(12)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText(data.subtitle || 'Top Players', x, y + this.scale(42));

    // Season badge (top-right)
    if (data.season) {
      this._renderBadge(ctx, width - this.scale(pad) - this.scale(80), y, this.scale(80), this.scale(28), data.season, tokens);
    }

    y += this.scale(60);

    // Leaderboard entries
    const entries = data.entries || [];
    const rowHeight = this.scale(56);

    for (let i = 0; i < Math.min(entries.length, 5); i++) {
      const entry = entries[i];
      const isTop3 = i < 3;

      // Row background (alternating/subtle)
      if (i % 2 === 0 || isTop3) {
        ctx.save();
        this.roundRectPath(ctx, x - this.scale(8), y, width - this.scale(pad * 2 - 16), rowHeight, this.scale(tokens['radius.inner']));
        ctx.fillStyle = isTop3 ? setAlpha(tokens['accent.primary'], 0.1) : tokens['surface.secondary'];
        ctx.fill();
        ctx.restore();
      }

      // Rank number
      const rankX = x + this.scale(12);
      const rankY = y + rowHeight / 2 + this.scale(6);

      if (isTop3) {
        // Top 3 get colored badges
        const rankColors = [tokens['accent.primary'], tokens['accent.secondary'], tokens['surface.tertiary']];
        ctx.fillStyle = rankColors[i];
        this.roundRectPath(ctx, rankX - this.scale(4), y + this.scale(12), this.scale(24), this.scale(24), this.scale(6));
        ctx.fill();
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = tokens['text.muted'];
      }

      ctx.font = `${this.getFontWeight('bold')} ${this.scale(14)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(String(i + 1), rankX + this.scale(8), rankY);
      ctx.textAlign = 'left';

      // Avatar
      const avatarSize = this.scale(36);
      await this._renderAvatar(ctx, rankX + this.scale(32), y + this.scale(10), avatarSize, entry.avatar, tokens, false);

      // Username
      const nameX = rankX + this.scale(80);
      ctx.font = `${this.getFontWeight('bold')} ${this.scale(14)}px Inter, sans-serif`;
      ctx.fillStyle = tokens['text.primary'];
      ctx.fillText(entry.username || 'User', nameX, y + this.scale(28));

      // Level
      ctx.font = `${this.getFontWeight('medium')} ${this.scale(11)}px Inter, sans-serif`;
      ctx.fillStyle = tokens['text.muted'];
      ctx.fillText(`Level ${entry.level || 1}`, nameX, y + this.scale(46));

      // Score (right-aligned)
      const score = entry.score || 0;
      ctx.font = `${this.getFontWeight('bold')} ${this.scale(14)}px Inter, sans-serif`;
      ctx.fillStyle = isTop3 ? tokens['accent.primary'] : tokens['text.secondary'];
      ctx.textAlign = 'right';
      ctx.fillText(score.toLocaleString(), width - this.scale(pad) - this.scale(8), y + this.scale(32));
      ctx.textAlign = 'left';

      y += rowHeight + this.scale(4);
    }
  }

  async _renderInviteCard(ctx, width, height, tokens, data) {
    const pad = tokens['spacing.lg'];
    const x = this.scale(pad);
    let y = this.scale(pad);

    // Header with avatar
    const avatarSize = this.scale(70);
    await this._renderAvatar(ctx, x, y, avatarSize, data.avatar, tokens, false);

    // User info
    const infoX = x + avatarSize + this.scale(pad);
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(20)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.primary'];
    ctx.fillText(data.username || 'User', infoX, y + this.scale(32));

    ctx.font = `${this.getFontWeight('medium')} ${this.scale(12)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.secondary'];
    ctx.fillText(data.subtitle || 'Community Member', infoX, y + this.scale(52));

    y += avatarSize + this.scale(pad);

    // Stats boxes (3 columns)
    const boxWidth = (width - this.scale(pad * 2 + 16)) / 3;
    const boxHeight = this.scale(60);

    const stats = [
      { label: 'Total Invites', value: data.invites || 0 },
      { label: 'Valid', value: data.valid || 0 },
      { label: 'Rewards', value: data.rewards || 0 }
    ];

    for (let i = 0; i < 3; i++) {
      const boxX = x + i * (boxWidth + this.scale(8));
      const highlight = i === 2;
      this._renderStatBox(ctx, boxX, y, boxWidth, boxHeight, stats[i], tokens, highlight);
    }

    y += boxHeight + this.scale(pad);

    // Progress section
    ctx.font = `${this.getFontWeight('medium')} ${this.scale(11)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.fillText('Next Milestone', x, y + this.scale(12));

    const progress = data.milestoneProgress || 0;
    const milestoneMax = data.milestoneMax || 250;
    ctx.textAlign = 'right';
    ctx.fillText(`${progress} / ${milestoneMax}`, width - this.scale(pad), y + this.scale(12));
    ctx.textAlign = 'left';

    this._renderProgressBar(ctx, x, y + this.scale(20), width - this.scale(pad * 2), tokens['progress.height'], progress, milestoneMax, tokens);
  }

  // ========== UTILITY RENDERERS ==========

  async _renderAvatar(ctx, x, y, size, src, tokens, withGlow = false) {
    const radius = this.scale(this.theme === 'minimalSoft' ? size / 2 : 12);

    if (withGlow) {
      setShadow(ctx, {
        color: tokens['accent.glow'],
        blur: this.scale(tokens['glow.strength']),
        offsetX: 0,
        offsetY: 0
      });
    }

    // Avatar border
    ctx.strokeStyle = tokens['accent.primary'];
    ctx.lineWidth = this.scale(2);
    this.roundRectPath(ctx, x, y, size, size, radius);
    ctx.stroke();

    if (withGlow) clearShadow(ctx);

    // Avatar background (placeholder - actual image would be drawn here)
    ctx.fillStyle = tokens['surface.tertiary'];
    this.roundRectPath(ctx, x + this.scale(2), y + this.scale(2), size - this.scale(4), size - this.scale(4), radius - this.scale(1));
    ctx.fill();

    // Avatar placeholder letter
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(size * 0.4)}px Inter, sans-serif`;
    ctx.fillStyle = tokens['text.muted'];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', x + size / 2, y + size / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  async _renderAlbumArt(ctx, x, y, size, src, tokens) {
    const radius = this.scale(tokens['radius.inner']);

    setShadow(ctx, {
      color: tokens['shadow.color'],
      blur: this.scale(tokens['shadow.blur'] / 2),
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
    // Circular badge
    ctx.fillStyle = tokens['accent.primary'];
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = tokens['surface.primary'];
    ctx.lineWidth = this.scale(3);
    ctx.stroke();

    // Level text
    ctx.font = `${this.getFontWeight('bold')} ${this.scale(size * 0.4)}px Inter, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(level), x + size / 2, y + size / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
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
    const radius = this.scale(tokens['progress.radius']);

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
          { pos: 1, color: tokens['accent.secondary'] }
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
}

module.exports = { CardRenderer };
