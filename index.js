/**
 * Modular - Production-grade Node.js canvas rendering engine for Discord cards
 * @module modular
 * 
 * @example
 * const { createEngine } = require('modular');
 * 
 * const engine = createEngine();
 * 
 * // Create rank card with Discord.js v14
 * const rankCard = engine.createRankCard()
 *   .setUser(interaction.options.getUser('user'))
 *   .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 })
 *   .setTheme('cyberpunk');
 * 
 * await rankCard.reply(interaction);
 */

'use strict';

// Core
const { Engine } = require('./src/core/Engine');
const { CardBuilder } = require('./src/core/CardBuilder');
const { RenderPipeline } = require('./src/core/RenderPipeline');

// Builders
const RankCardBuilder = require('./src/builders/RankCardBuilder');
const MusicCardBuilder = require('./src/builders/MusicCardBuilder');
const LeaderboardCardBuilder = require('./src/builders/LeaderboardCardBuilder');
const InviteCardBuilder = require('./src/builders/InviteCardBuilder');
const ProfileCardBuilder = require('./src/builders/ProfileCardBuilder');
const WelcomeCardBuilder = require('./src/builders/WelcomeCardBuilder');

// Renderer
const { CanvasRenderer, RenderContext } = require('./src/renderer/CanvasRenderer');
const { AssetLoader } = require('./src/renderer/AssetLoader');
const { BufferManager } = require('./src/renderer/BufferManager');

// Layout
const { LayoutParser } = require('./src/layout/LayoutParser');
const { LayoutResolver } = require('./src/layout/LayoutResolver');

// Styling
const { StyleEngine } = require('./src/styling/StyleEngine');
const { TokenEngine } = require('./src/styling/TokenEngine');

// Components
const { BaseComponent, ComponentRegistry } = require('./src/components/base/BaseComponent');
const { ContainerComponent } = require('./src/components/ui/ContainerComponent');
const { AvatarComponent } = require('./src/components/ui/AvatarComponent');
const { TextComponent } = require('./src/components/ui/TextComponent');
const { ProgressComponent } = require('./src/components/ui/ProgressComponent');
const { MediaComponent } = require('./src/components/ui/MediaComponent');

// Themes
const { ThemeManager, BaseTheme, cyberpunkTheme, neonTheme, darkTheme, midnightTheme } = require('./src/themes/ThemeManager');

// Plugins
const { PluginManager, BasePlugin } = require('./src/plugins/PluginManager');

// Cache
const { LRUCache } = require('./src/cache/LRUCache');
const { AssetCache } = require('./src/cache/AssetCache');

// Utils
const { clamp, lerp, mapRange, round, distance, pointInRect } = require('./src/utils/math');
const { hexToRgb, rgbToArray, rgbToHex, parseColor, lighten, darken, setAlpha, clamp: colorClamp } = require('./src/utils/color');
const { roundRect, measureText, setFont, setShadow, clearShadow, createLinearGradient, createRadialGradient, drawCircle, clipRoundRect } = require('./src/utils/canvas');

/**
 * Create a new engine instance
 * @param {Object} [options] - Engine options
 * @param {number} [options.dpi=2] - Canvas DPI scaling
 * @param {Object} [options.cache] - Cache configuration
 * @param {boolean} [options.debug=false] - Enable debug mode
 * @returns {Engine}
 */
function createEngine(options = {}) {
  const engine = new Engine(options);

  // Register default components
  engine.componentRegistry.register('container', ContainerComponent);
  engine.componentRegistry.register('avatar', AvatarComponent);
  engine.componentRegistry.register('text', TextComponent);
  engine.componentRegistry.register('progress', ProgressComponent);
  engine.componentRegistry.register('media', MediaComponent);

  // Register default themes
  engine.themeManager.register('cyberpunk', cyberpunkTheme);
  engine.themeManager.register('neon', neonTheme);
  engine.themeManager.register('dark', darkTheme);
  engine.themeManager.register('midnight', midnightTheme);

  return engine;
}

// Main exports
module.exports = {
  // Factory function
  createEngine,

  // Core classes
  Engine,
  CardBuilder,
  RenderPipeline,

  // Dedicated Builders (Discord.js v14 optimized)
  RankCardBuilder,
  MusicCardBuilder,
  LeaderboardCardBuilder,
  InviteCardBuilder,
  ProfileCardBuilder,
  WelcomeCardBuilder,

  // Renderer
  CanvasRenderer,
  RenderContext,
  AssetLoader,
  BufferManager,

  // Layout
  LayoutParser,
  LayoutResolver,

  // Styling
  StyleEngine,
  TokenEngine,

  // Components
  BaseComponent,
  ComponentRegistry,
  ContainerComponent,
  AvatarComponent,
  TextComponent,
  ProgressComponent,
  MediaComponent,

  // Themes
  ThemeManager,
  BaseTheme,
  cyberpunkTheme,
  neonTheme,
  darkTheme,
  midnightTheme,

  // Plugins
  PluginManager,
  BasePlugin,

  // Cache
  LRUCache,
  AssetCache,

  // Utils - Math
  clamp,
  lerp,
  mapRange,
  round,
  distance,
  pointInRect,

  // Utils - Color
  hexToRgb,
  rgbToArray,
  rgbToHex,
  parseColor,
  lighten,
  darken,
  setAlpha,

  // Utils - Canvas
  roundRect,
  measureText,
  setFont,
  setShadow,
  clearShadow,
  createLinearGradient,
  createRadialGradient,
  drawCircle,
  clipRoundRect
};
