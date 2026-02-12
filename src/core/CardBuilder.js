/**
 * CardBuilder - Fluent API for building Discord cards
 * @module CardBuilder
 * 
 * @example
 * const engine = createEngine();
 * const card = engine.createCard('rank')
 *   .setUser(discordUser)
 *   .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 })
 *   .setTheme('cyberpunk');
 * 
 * const buffer = await card.render();
 */

'use strict';

/**
 * CardBuilder - Provides a fluent API for building Discord cards
 */
class CardBuilder {
  /**
   * @param {Engine} engine - Parent engine instance
   */
  constructor(engine) {
    this.engine = engine;

    this.config = {
      width: 800,
      height: 400,
      dpi: engine.config.dpi || 2,
      theme: 'default',
      preset: null,
      layout: { type: 'container', children: [] },
      tokens: {},
      data: {},
      effects: []
    };
  }

  // ==================== Size Configuration ====================

  /**
   * Set card dimensions
   * @param {number} width - Card width
   * @param {number} height - Card height
   * @returns {CardBuilder}
   */
  setSize(width, height) {
    this.config.width = Number(width) || 800;
    this.config.height = Number(height) || 400;
    return this;
  }

  /**
   * Set DPI scaling
   * @param {number} dpi - DPI value
   * @returns {CardBuilder}
   */
  setDpi(dpi) {
    this.config.dpi = Number(dpi) || 2;
    return this;
  }

  /**
   * Set card preset (rank, music, leaderboard, invite)
   * @param {string} preset - Preset name
   * @param {Object} [options] - Preset options
   * @returns {CardBuilder}
   */
  setPreset(preset, options = {}) {
    const validPresets = ['rank', 'music', 'leaderboard', 'invite', 'profile', 'welcome'];
    if (!validPresets.includes(preset)) {
      throw new Error(`Invalid preset: ${preset}. Valid presets: ${validPresets.join(', ')}`);
    }
    
    this.config.preset = preset;
    this.config.layout = this._getPresetLayout(preset, options);
    return this;
  }

  /**
   * Get preset layout configuration
   * @private
   * @param {string} preset
   * @param {Object} options
   * @returns {Object}
   */
  _getPresetLayout(preset, options) {
    const layouts = {
      rank: this._createRankLayout(options),
      music: this._createMusicLayout(options),
      leaderboard: this._createLeaderboardLayout(options),
      invite: this._createInviteLayout(options),
      profile: this._createProfileLayout(options),
      welcome: this._createWelcomeLayout(options)
    };
    return layouts[preset] || layouts.rank;
  }

  /**
   * Create rank card layout
   * @private
   */
  _createRankLayout(options = {}) {
    return {
      type: 'rank-card',
      props: { ...options },
      children: [
        { type: 'avatar', props: { x: 20, y: 20, size: 90, slot: 'avatar' } },
        { type: 'text', props: { x: 130, y: 45, slot: 'username', style: { fontSize: 26, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 130, y: 75, slot: 'rank', style: { fontSize: 14, color: '{accent.primary}' } } },
        { type: 'level-box', props: { x: 620, y: 20, width: 80, height: 50, slot: 'level' } },
        { type: 'progress', props: { x: 130, y: 130, width: 650, height: 8, slot: 'xp' } },
        { type: 'text', props: { x: 130, y: 155, slot: 'xp-text', style: { fontSize: 10 } } }
      ]
    };
  }

  /**
   * Create music card layout
   * @private
   */
  _createMusicLayout(options = {}) {
    return {
      type: 'music-card',
      props: { ...options },
      children: [
        { type: 'album-art', props: { x: 20, y: 40, size: 100, slot: 'album' } },
        { type: 'text', props: { x: 140, y: 50, slot: 'label', style: { fontSize: 11, color: '{accent.primary}' } } },
        { type: 'text', props: { x: 140, y: 78, slot: 'title', style: { fontSize: 22, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 140, y: 105, slot: 'artist', style: { fontSize: 14 } } },
        { type: 'progress', props: { x: 140, y: 155, width: 520, height: 6, slot: 'progress' } },
        { type: 'text', props: { x: 140, y: 180, slot: 'time-current', style: { fontSize: 11 } } },
        { type: 'text', props: { x: 640, y: 180, slot: 'time-total', style: { fontSize: 11 } } }
      ]
    };
  }

  /**
   * Create leaderboard card layout
   * @private
   */
  _createLeaderboardLayout(options = {}) {
    return {
      type: 'leaderboard-card',
      props: { ...options },
      children: [
        { type: 'text', props: { x: 20, y: 30, slot: 'title', style: { fontSize: 20, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 20, y: 55, slot: 'subtitle', style: { fontSize: 12 } } }
      ]
    };
  }

  /**
   * Create invite card layout
   * @private
   */
  _createInviteLayout(options = {}) {
    return {
      type: 'invite-card',
      props: { ...options },
      children: [
        { type: 'avatar', props: { x: 20, y: 20, size: 70, slot: 'avatar' } },
        { type: 'text', props: { x: 110, y: 50, slot: 'username', style: { fontSize: 20, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 110, y: 75, slot: 'subtitle', style: { fontSize: 12 } } },
        { type: 'stat-box', props: { x: 20, y: 120, width: 240, height: 60, slot: 'invites' } },
        { type: 'stat-box', props: { x: 275, y: 120, width: 240, height: 60, slot: 'valid' } },
        { type: 'stat-box', props: { x: 530, y: 120, width: 240, height: 60, slot: 'rewards' } }
      ]
    };
  }

  /**
   * Create profile card layout
   * @private
   */
  _createProfileLayout(options = {}) {
    return {
      type: 'profile-card',
      props: { ...options },
      children: [
        { type: 'avatar', props: { x: 20, y: 20, size: 100, slot: 'avatar' } },
        { type: 'text', props: { x: 140, y: 50, slot: 'username', style: { fontSize: 24, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 140, y: 80, slot: 'tag', style: { fontSize: 14 } } },
        { type: 'progress', props: { x: 20, y: 150, width: 760, height: 6, slot: 'xp' } },
        { type: 'text', props: { x: 20, y: 175, slot: 'level', style: { fontSize: 12 } } }
      ]
    };
  }

  /**
   * Create welcome card layout
   * @private
   */
  _createWelcomeLayout(options = {}) {
    return {
      type: 'welcome-card',
      props: { ...options },
      children: [
        { type: 'avatar', props: { x: 350, y: 30, size: 80, slot: 'avatar' } },
        { type: 'text', props: { x: 400, y: 130, slot: 'welcome-text', style: { fontSize: 18 } } },
        { type: 'text', props: { x: 400, y: 160, slot: 'username', style: { fontSize: 28, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 400, y: 200, slot: 'member-count', style: { fontSize: 14 } } }
      ]
    };
  }

  // ==================== Theme Configuration ====================

  /**
   * Set theme
   * @param {string} themeName - Theme identifier
   * @returns {CardBuilder}
   */
  setTheme(themeName) {
    if (!themeName || typeof themeName !== 'string') {
      throw new Error('Theme name must be a non-empty string');
    }
    this.config.theme = themeName;
    return this;
  }

  /**
   * Override theme colors for this card
   * @param {Object} colors - Color overrides
   * @returns {CardBuilder}
   */
  setColors(colors) {
    if (colors && typeof colors === 'object') {
      this.config.tokens = { ...this.config.tokens, ...this._flattenColors(colors) };
    }
    return this;
  }

  /**
   * Flatten color object to token format
   * @private
   */
  _flattenColors(colors, prefix = 'color') {
    const result = {};
    for (const [key, value] of Object.entries(colors)) {
      if (value && typeof value === 'object' && !value.r) {
        Object.assign(result, this._flattenColors(value, `${prefix}.${key}`));
      } else {
        result[`${prefix}.${key}`] = value;
      }
    }
    return result;
  }

  // ==================== Data Configuration ====================

  /**
   * Set Discord user data
   * @param {Object} user - User object from Discord.js
   * @param {string} user.username - Username
   * @param {string} [user.discriminator] - Discriminator
   * @param {string} [user.avatar] - Avatar hash or URL
   * @param {string} [user.displayAvatarURL] - Method to get avatar URL
   * @param {string} [user.tag] - Full username#discriminator
   * @param {string} [user.status] - Online status
   * @param {string} [user.banner] - Banner URL
   * @returns {CardBuilder}
   */
  setUser(user) {
    if (!user) return this;

    const avatarUrl = this._getAvatarUrl(user);
    
    this.setData({
      username: user.username || 'User',
      discriminator: user.discriminator || user.tag?.split('#')[1] || '0000',
      tag: user.tag || `${user.username}#${user.discriminator || '0000'}`,
      avatar: avatarUrl,
      status: user.status || 'online',
      banner: this._getBannerUrl(user),
      displayName: user.displayName || user.username
    });
    
    return this;
  }

  /**
   * Get avatar URL from user object
   * @private
   */
  _getAvatarUrl(user) {
    if (typeof user.displayAvatarURL === 'function') {
      return user.displayAvatarURL({ format: 'png', size: 256 });
    }
    return user.avatar;
  }

  /**
   * Get banner URL from user object
   * @private
   */
  _getBannerUrl(user) {
    if (typeof user.bannerURL === 'function') {
      return user.bannerURL();
    }
    return user.banner;
  }

  /**
   * Set Discord guild/server data
   * @param {Object} guild - Guild object from Discord.js
   * @param {string} guild.name - Guild name
   * @param {string} [guild.icon] - Icon hash or URL
   * @param {number} [guild.memberCount] - Member count
   * @returns {CardBuilder}
   */
  setGuild(guild) {
    if (!guild) return this;

    const iconUrl = this._getGuildIconUrl(guild);
    
    this.setData({
      guildName: guild.name || 'Server',
      guildIcon: iconUrl,
      memberCount: guild.memberCount,
      guildId: guild.id
    });
    
    return this;
  }

  /**
   * Get guild icon URL
   * @private
   */
  _getGuildIconUrl(guild) {
    if (typeof guild.iconURL === 'function') {
      return guild.iconURL({ format: 'png', size: 128 });
    }
    return guild.icon;
  }

  /**
   * Set music track data for music cards
   * @param {Object} track - Track metadata
   * @param {string} track.title - Track title
   * @param {string} [track.artist] - Artist name
   * @param {string} [track.albumArt] - Album art URL
   * @param {number} [track.duration] - Duration in seconds
   * @param {number} [track.currentTime] - Current position in seconds
   * @param {boolean} [track.isPlaying] - Playing state
   * @returns {CardBuilder}
   */
  setTrack(track) {
    if (!track) return this;

    this.setData({
      trackName: track.title || track.name || 'Unknown Track',
      artist: track.artist || track.author || 'Unknown Artist',
      albumArt: track.thumbnail || track.image || track.albumArt,
      duration: Number(track.duration) || 0,
      currentTime: Number(track.currentTime) || 0,
      isPlaying: track.isPlaying !== undefined ? track.isPlaying : true,
      paused: track.paused || false
    });
    
    return this;
  }

  /**
   * Set statistics for rank/leaderboard cards
   * @param {Object} stats - Stats object
   * @param {number} [stats.level] - Current level
   * @param {number} [stats.rank] - Current rank
   * @param {number} [stats.xp] - Current XP
   * @param {number} [stats.maxXp] - XP required for next level
   * @param {number} [stats.score] - Score/points
   * @returns {CardBuilder}
   */
  setStats(stats) {
    if (!stats) return this;

    const xp = Number(stats.xp) || 0;
    const maxXp = Number(stats.maxXp) || stats.requiredXP || 1000;
    
    this.setData({
      level: Number(stats.level) || 1,
      rank: Number(stats.rank) || 0,
      xp,
      maxXp,
      progress: maxXp > 0 ? (xp / maxXp) * 100 : 0,
      score: Number(stats.score) || 0,
      requiredXP: stats.requiredXP
    });
    
    return this;
  }

  /**
   * Set leaderboard data
   * @param {Object} leaderboard - Leaderboard data
   * @param {string} [leaderboard.title] - Leaderboard title
   * @param {string} [leaderboard.subtitle] - Subtitle
   * @param {Array} leaderboard.entries - Array of entries
   * @param {string} [leaderboard.season] - Season identifier
   * @returns {CardBuilder}
   */
  setLeaderboard(leaderboard) {
    if (!leaderboard) return this;

    this.setData({
      title: leaderboard.title || 'Leaderboard',
      subtitle: leaderboard.subtitle || 'Top Players',
      entries: leaderboard.entries || [],
      season: leaderboard.season
    });
    
    return this;
  }

  /**
   * Set invite data
   * @param {Object} invite - Invite data
   * @param {number} [invite.invites] - Total invites
   * @param {number} [invite.valid] - Valid invites
   * @param {number} [invite.rewards] - Rewards earned
   * @param {number} [invite.milestoneProgress] - Progress to next milestone
   * @param {number} [invite.milestoneMax] - Target for milestone
   * @returns {CardBuilder}
   */
  setInvite(invite) {
    if (!invite) return this;

    this.setData({
      invites: Number(invite.invites) || 0,
      valid: Number(invite.valid) || 0,
      rewards: Number(invite.rewards) || 0,
      milestoneProgress: Number(invite.milestoneProgress) || 0,
      milestoneMax: Number(invite.milestoneMax) || 250
    });
    
    return this;
  }

  /**
   * Set custom data
   * @param {Object} data - Data object
   * @returns {CardBuilder}
   */
  setData(data) {
    if (data && typeof data === 'object') {
      this.config.data = { ...this.config.data, ...data };
    }
    return this;
  }

  // ==================== Layout Configuration ====================

  /**
   * Set layout definition
   * @param {Object} layout - Layout object or JSON DSL
   * @returns {CardBuilder}
   */
  setLayout(layout) {
    if (layout && typeof layout === 'object') {
      this.config.layout = layout;
      this.config.preset = null;
    }
    return this;
  }

  /**
   * Add a component to the layout
   * @param {string} type - Component type
   * @param {Object} props - Component properties
   * @param {string} [slot] - Optional slot name
   * @returns {CardBuilder}
   */
  addComponent(type, props = {}, slot = null) {
    const component = { type, props };

    if (slot) {
      this._addToSlot(slot, component);
    } else {
      this.config.layout.children = this.config.layout.children || [];
      this.config.layout.children.push(component);
    }

    return this;
  }

  /**
   * Add component to a named slot
   * @private
   */
  _addToSlot(slotName, component) {
    let slotContainer = this.config.layout.children?.find(
      c => c.props?.slot === slotName
    );

    if (!slotContainer) {
      slotContainer = {
        type: 'container',
        props: { slot: slotName },
        children: []
      };
      this.config.layout.children = this.config.layout.children || [];
      this.config.layout.children.push(slotContainer);
    }

    slotContainer.children = slotContainer.children || [];
    slotContainer.children.push(component);
  }

  // ==================== Token Configuration ====================

  /**
   * Set design tokens
   * @param {Object} tokens - Token definitions
   * @returns {CardBuilder}
   */
  setTokens(tokens) {
    if (tokens && typeof tokens === 'object') {
      this.config.tokens = { ...this.config.tokens, ...tokens };
    }
    return this;
  }

  /**
   * Set a single design token
   * @param {string} name - Token name
   * @param {*} value - Token value
   * @returns {CardBuilder}
   */
  setToken(name, value) {
    if (name && typeof name === 'string') {
      this.config.tokens[name] = value;
    }
    return this;
  }

  // ==================== Effect Configuration ====================

  /**
   * Add FX effect
   * @param {string} type - Effect type (glow|blur|shadow|gradient)
   * @param {Object} options - Effect options
   * @returns {CardBuilder}
   */
  addEffect(type, options = {}) {
    if (type && typeof type === 'string') {
      this.config.effects.push({ type, ...options });
    }
    return this;
  }

  /**
   * Set background configuration
   * @param {Object} background - Background configuration
   * @param {string} [background.color] - Background color
   * @param {string} [background.gradient] - Gradient start color
   * @returns {CardBuilder}
   */
  setBackground(background) {
    if (background && typeof background === 'object') {
      this.config.background = background;
    }
    return this;
  }

  /**
   * Enable/disable glow effect
   * @param {boolean} [enabled=true]
   * @param {string} [color] - Glow color
   * @param {number} [blur] - Blur amount
   * @returns {CardBuilder}
   */
  setGlow(enabled = true, color = null, blur = null) {
    this.config.effects = this.config.effects.filter(e => e.type !== 'glow');
    if (enabled) {
      this.config.effects.push({
        type: 'glow',
        color: color || '{accent.glow}',
        blur: blur || 20
      });
    }
    return this;
  }

  // ==================== Render ====================

  /**
   * Render the card
   * @param {Object} [options] - Render options
   * @param {string} [options.format='png'] - Output format (png|jpg|webp)
   * @param {number} [options.quality=0.92] - Image quality (0-1)
   * @returns {Promise<Buffer>} - Rendered image buffer
   */
  async render(options = {}) {
    const layout = this._buildLayout();

    return this.engine.render(layout, this.config.data, {
      width: this.config.width,
      height: this.config.height,
      dpi: this.config.dpi,
      theme: this.config.theme,
      effects: this.config.effects,
      ...options
    });
  }

  /**
   * Render card to Buffer (alias for render)
   * @param {Object} [options]
   * @returns {Promise<Buffer>}
   */
  async toBuffer(options = {}) {
    return this.render(options);
  }

  /**
   * Build final layout structure
   * @private
   * @returns {Object}
   */
  _buildLayout() {
    const layout = {
      ...this.config.layout,
      width: this.config.width,
      height: this.config.height,
      tokens: { ...this.config.tokens },
      effects: [...this.config.effects],
      background: this.config.background
    };

    // Apply theme tokens
    const theme = this.engine.themeManager.get(this.config.theme);
    if (theme) {
      layout.tokens = {
        ...this._themeToTokens(theme),
        ...layout.tokens
      };
    }

    return layout;
  }

  /**
   * Convert theme to flat token object
   * @private
   */
  _themeToTokens(theme) {
    const tokens = {};
    
    if (theme.colors) {
      this._flattenColorsToTokens(theme.colors, 'color', tokens);
    }
    
    if (theme.fonts) {
      tokens['font.primary'] = theme.fonts.primary;
      tokens['font.sizes.xs'] = theme.fonts.sizes?.xs;
      tokens['font.sizes.sm'] = theme.fonts.sizes?.sm;
      tokens['font.sizes.md'] = theme.fonts.sizes?.md;
      tokens['font.sizes.lg'] = theme.fonts.sizes?.lg;
    }
    
    if (theme.effects) {
      tokens['effect.glowStrength'] = theme.effects.glowStrength;
      tokens['effect.borderRadius'] = theme.effects.borderRadius;
    }
    
    return tokens;
  }

  /**
   * Flatten nested object to tokens
   * @private
   */
  _flattenColorsToTokens(obj, prefix, result = {}) {
    for (const [key, value] of Object.entries(obj)) {
      const tokenName = `${prefix}.${key}`;
      if (value && typeof value === 'object' && !value.startsWith) {
        this._flattenColorsToTokens(value, tokenName, result);
      } else {
        result[tokenName] = value;
      }
    }
    return result;
  }

  /**
   * Get current configuration
   * @returns {Object}
   */
  getConfig() {
    return { ...this.config };
  }
}

module.exports = CardBuilder;
