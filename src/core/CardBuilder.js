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

const { ValidationError } = require('../errors/ModularError');

/**
 * CardBuilder - Provides a fluent API for building Discord cards
 */
class CardBuilder {
  /**
   * @param {Engine} [engine] - Parent engine instance (optional)
   */
  constructor(engine) {
    // If no engine provided, use/create a default singleton engine for simplicity
    if (!engine) {
      const { createEngine } = require('./Engine');
      // We use a global/cached default engine to avoid re-initializing fonts/themes
      if (!global.__MODULAR_DEFAULT_ENGINE__) {
        global.__MODULAR_DEFAULT_ENGINE__ = createEngine();
      }
      this.engine = global.__MODULAR_DEFAULT_ENGINE__;
    } else {
      this.engine = engine;
    }

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

  /**
   * Get string representation for debugging
   * @returns {string}
   */
  toString() {
    return `CardBuilder[${this.config.preset || 'custom'}]`;
  }

  /**
   * Get JSON representation for debugging
   * @returns {Object}
   */
  toJSON() {
    return {
      type: 'CardBuilder',
      preset: this.config.preset,
      layout: this.config.layout,
      options: {
        width: this.config.width,
        height: this.config.height,
        dpi: this.config.dpi,
        theme: this.config.theme
      }
    };
  }

  // ==================== Size Configuration ====================

  /**
   * Set card dimensions
   * @param {number} width - Card width (1-4096)
   * @param {number} height - Card height (1-4096)
   * @returns {CardBuilder} This builder instance for method chaining
   * @throws {ValidationError} If dimensions are invalid
   */
  setSize(width, height) {
    const w = Number(width);
    const h = Number(height);
    if (!w || w <= 0 || w > 4096) {
      throw new ValidationError(`Invalid width: ${width}. Must be 1-4096.`, { field: 'width', value: width });
    }
    if (!h || h <= 0 || h > 4096) {
      throw new ValidationError(`Invalid height: ${height}. Must be 1-4096.`, { field: 'height', value: height });
    }
    this.config.width = w;
    this.config.height = h;
    return this;
  }

  /**
   * Set DPI scaling
   * @param {number} dpi - DPI value (1-4)
   * @returns {CardBuilder} This builder instance for method chaining
   * @throws {ValidationError} If DPI is invalid
   */
  setDpi(dpi) {
    const d = Number(dpi);
    if (!d || d < 1 || d > 4) {
      throw new ValidationError(`Invalid DPI: ${dpi}. Must be 1-4.`, { field: 'dpi', value: dpi });
    }
    this.config.dpi = d;
    return this;
  }

  /**
   * Set card preset (rank, music, leaderboard, invite, profile, welcome)
   * @param {string} preset - Preset name
   * @param {Object} [options] - Preset options
   * @returns {CardBuilder} This builder instance for method chaining
   * @throws {ValidationError} If preset is invalid
   */
  setPreset(preset, options = {}) {
    const validPresets = ['rank', 'music', 'leaderboard', 'invite', 'profile', 'welcome'];
    if (!validPresets.includes(preset)) {
      throw new ValidationError(`Invalid preset: "${preset}". Valid presets: ${validPresets.join(', ')}`, { field: 'preset', value: preset, validPresets });
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
      children: []
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
      children: []
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
      children: []
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
      children: []
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
      children: []
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
      children: []
    };
  }

  // ==================== Theme Configuration ====================

  /**
   * Set theme for this card
   * @param {string} themeName - Theme identifier
   * @returns {CardBuilder} This builder instance for method chaining
   * @throws {Error} If theme name is invalid
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @param {Function} [user.displayAvatarURL] - Method to get avatar URL
   * @param {string} [user.tag] - Full username#discriminator
   * @param {string} [user.status] - Online status
   * @param {string} [user.banner] - Banner URL
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @param {Object} [props={}] - Component properties
   * @param {string} [slot=null] - Optional slot name
   * @returns {CardBuilder} This builder instance for method chaining
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
   * Set design tokens overrides
   * @param {Object} tokens - Token definitions
   * @returns {CardBuilder} This builder instance for method chaining
   */
  setTokens(tokens) {
    if (tokens && typeof tokens === 'object') {
      this.config.tokens = { ...this.config.tokens, ...tokens };
    }
    return this;
  }

  /**
   * Set a single design token override
   * @param {string} name - Token name
   * @param {*} value - Token value
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @param {Object} [options={}] - Effect options
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * @returns {CardBuilder} This builder instance for method chaining
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
   * Render the card to a Buffer
   * @param {Object} [options] - Render options
   * @param {string} [options.format='png'] - Output format (png|jpg|webp)
   * @param {number} [options.quality=0.92] - Image quality (0-1)
   * @returns {Promise<Buffer>} Rendered image buffer
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
   * @param {Object} [options] - Render options
   * @returns {Promise<Buffer>} Rendered image buffer
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
    const { flattenTheme } = require('../canvas/themes/index');
    return flattenTheme(theme);
  }

  /**
   * Flatten nested object to tokens
   * @private
   */
  _flattenColorsToTokens(obj, prefix, result = {}) {
    if (!obj || typeof obj !== 'object') return result;

    for (const [key, value] of Object.entries(obj)) {
      const tokenName = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
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

  /**
   * Reply to a Discord interaction with the rendered card
   * @param {Object} interaction - Discord.js interaction (Command, Button, SelectMenu)
   * @param {Object} [options] - Reply options
   * @param {string} [options.filename] - Attachment filename
   * @param {boolean} [options.ephemeral=false] - Whether the reply is ephemeral
   * @returns {Promise<void>}
   */
  async reply(interaction, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const defaultName = `${this.config.preset || 'card'}.png`;
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || defaultName });

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        files: [attachment],
        ...options
      });
    } else {
      await interaction.reply({
        files: [attachment],
        ephemeral: options.ephemeral || false,
        ...options
      });
    }
  }

  /**
   * Follow up to a Discord interaction with the rendered card
   * @param {Object} interaction - Discord.js interaction
   * @param {Object} [options] - Follow-up options
   * @param {string} [options.filename] - Attachment filename
   * @param {boolean} [options.ephemeral=false] - Whether the follow-up is ephemeral
   * @returns {Promise<void>}
   */
  async followUp(interaction, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const defaultName = `${this.config.preset || 'card'}.png`;
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || defaultName });

    await interaction.followUp({
      files: [attachment],
      ephemeral: options.ephemeral || false,
      ...options
    });
  }

  /**
   * Send the rendered card to a Discord channel
   * @param {Object} channel - Discord.js channel object
   * @param {Object} [options] - Send options
   * @param {string} [options.filename] - Attachment filename
   * @returns {Promise<Object>} Sent message object
   */
  async send(channel, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const defaultName = `${this.config.preset || 'card'}.png`;
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || defaultName });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = CardBuilder;

