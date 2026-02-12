/**
 * Type definitions for @modular/card-engine
 */

declare module '@modular/card-engine' {
  import { Canvas, CanvasRenderingContext2D, GlobalFonts, Image } from '@napi-rs/canvas';
  import { EventEmitter } from 'events';
  import {
    ChatInputCommandInteraction,
    ButtonInteraction,
    StringSelectInteraction,
    User,
    GuildMember,
    AttachmentBuilder,
    TextChannel,
    NewsChannel,
    DMChannel,
    ThreadChannel,
    Message
  } from 'discord.js';

  // ==================== Engine Options ====================

  export interface EngineOptions {
    dpi?: number;
    cache?: {
      maxSize?: number;
      ttl?: number;
    };
    renderer?: {
      maxPoolSize?: number;
    };
    debug?: boolean;
  }

  export interface RenderOptions {
    format?: 'png' | 'jpg' | 'jpeg' | 'webp';
    quality?: number;
  }

  // ==================== Core Classes ====================

  export class Engine extends EventEmitter {
    constructor(options?: EngineOptions);

    // Builder Factory Methods
    createCard(): CardBuilder;
    createRankCard(): RankCardBuilder;
    createMusicCard(): MusicCardBuilder;
    createLeaderboardCard(): LeaderboardCardBuilder;
    createInviteCard(): InviteCardBuilder;
    createProfileCard(): ProfileCardBuilder;
    createWelcomeCard(): WelcomeCardBuilder;

    // Theme System
    setTheme(themeName: string): this;
    registerTheme(name: string, theme: ThemeDefinition, base?: string | null): this;
    extendTheme(baseName: string, newName: string, overrides: ThemeDefinition): ThemeDefinition;

    // Token System
    defineToken(name: string, value: unknown): this;
    defineTokens(tokens: Record<string, unknown>): this;

    // Component System
    registerComponent(name: string, ComponentClass: typeof BaseComponent): this;
    overrideComponent(name: string, ComponentClass: typeof BaseComponent): this;

    // Hook System
    onHook(event: string, callback: HookCallback): this;

    // Rendering
    render(layout: LayoutNode, data?: Record<string, unknown>, options?: RenderOptions): Promise<Buffer>;
    renderPreset(preset: string, data?: Record<string, unknown>, options?: RenderOptions): Promise<Buffer>;

    // Cache
    clearCache(): void;
    getCacheStats(): { size: number; maxSize: number };

    // Utility
    getVersion(): string;
    listThemes(): string[];
    listComponents(): string[];
    listPlugins(): string[];
  }

  // ==================== Card Builder ====================

  export class CardBuilder {
    constructor(engine: Engine);

    // Size & Theme
    setSize(width: number, height: number): this;
    setDpi(dpi: number): this;
    setPreset(preset: 'rank' | 'music' | 'leaderboard' | 'invite' | 'profile' | 'welcome', options?: Record<string, unknown>): this;
    setTheme(themeName: string): this;
    setColors(colors: Record<string, unknown>): this;

    // Data
    setData(data: Record<string, unknown>): this;
    setTokens(tokens: Record<string, unknown>): this;
    setToken(name: string, value: unknown): this;

    // Layout
    setLayout(layout: LayoutNode): this;
    addComponent(type: string, props?: Record<string, unknown>, slot?: string): this;

    // Effects
    addEffect(type: string, options?: Record<string, unknown>): this;
    setBackground(background: { color?: string; gradient?: string }): this;
    setGlow(enabled?: boolean, color?: string, blur?: number): this;

    // Rendering
    render(options?: RenderOptions): Promise<Buffer>;
    toBuffer(options?: RenderOptions): Promise<Buffer>;
    getConfig(): Record<string, unknown>;
  }

  // ==================== Rank Card Builder ====================

  export class RankCardBuilder extends CardBuilder {
    setUser(user: User | GuildMember): this;
    setStats(stats: {
      level?: number;
      rank?: number;
      xp?: number;
      maxXp?: number;
    }): this;
    setLevel(level: number): this;
    setRank(rank: number): this;
    setXP(xp: number, maxXp?: number): this;
    setUsername(username: string): this;
    setAvatar(url: string): this;
    setStatus(status: 'online' | 'idle' | 'dnd' | 'offline' | 'streaming'): this;
    
    // Discord.js v14 Methods
    reply(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: ReplyOptions): Promise<void>;
    followUp(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: FollowUpOptions): Promise<void>;
    send(channel: TextChannel | NewsChannel | DMChannel | ThreadChannel, options?: SendOptions): Promise<Message>;
  }

  // ==================== Music Card Builder ====================

  export class MusicCardBuilder extends CardBuilder {
    setTrack(track: {
      title?: string;
      name?: string;
      artist?: string;
      author?: string;
      albumArt?: string;
      thumbnail?: string;
      image?: string;
      duration?: number;
      currentTime?: number;
      isPlaying?: boolean;
    }): this;
    setTitle(title: string): this;
    setArtist(artist: string): this;
    setAlbumArt(url: string): this;
    setDuration(duration: number): this;
    setCurrentTime(currentTime: number): this;
    setPlaying(isPlaying: boolean): this;
    setNowPlayingLabel(label?: string): this;
    
    // Discord.js v14 Methods
    reply(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: ReplyOptions): Promise<void>;
    followUp(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: FollowUpOptions): Promise<void>;
    send(channel: TextChannel | NewsChannel | DMChannel | ThreadChannel, options?: SendOptions): Promise<Message>;

    static formatTime(seconds: number): string;
  }

  // ==================== Leaderboard Card Builder ====================

  export class LeaderboardCardBuilder extends CardBuilder {
    setLeaderboard(leaderboard: {
      title?: string;
      subtitle?: string;
      season?: string;
      entries?: LeaderboardEntry[];
    }): this;
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setSeason(season: string): this;
    setEntries(entries: LeaderboardEntry[]): this;
    addEntry(entry: LeaderboardEntry): this;
    fromArray(data: Array<{ username?: string; name?: string; score?: number; xp?: number; points?: number; level?: number; avatar?: string }>): this;
    sortByScore(order?: 'asc' | 'desc'): this;
    limit(count: number): this;
    
    // Discord.js v14 Methods
    reply(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: ReplyOptions): Promise<void>;
    followUp(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: FollowUpOptions): Promise<void>;
    send(channel: TextChannel | NewsChannel | DMChannel | ThreadChannel, options?: SendOptions): Promise<Message>;
  }

  // ==================== Invite Card Builder ====================

  export class InviteCardBuilder extends CardBuilder {
    setUser(user: User | GuildMember): this;
    setInvite(invite: {
      invites?: number;
      valid?: number;
      rewards?: number;
      milestoneProgress?: number;
      milestoneMax?: number;
    }): this;
    setInvites(count: number): this;
    setValid(count: number): this;
    setRewards(count: number): this;
    setMilestone(progress: number, max?: number): this;
    setSubtitle(subtitle: string): this;
    addInvites(count: number): this;
    calculateMilestone(totalInvites: number, milestoneSize?: number): this;
    
    // Discord.js v14 Methods
    reply(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: ReplyOptions): Promise<void>;
    followUp(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: FollowUpOptions): Promise<void>;
    send(channel: TextChannel | NewsChannel | DMChannel | ThreadChannel, options?: SendOptions): Promise<Message>;
  }

  // ==================== Profile Card Builder ====================

  export class ProfileCardBuilder extends CardBuilder {
    setUser(user: User | GuildMember): this;
    setStats(stats: {
      level?: number;
      xp?: number;
      maxXp?: number;
      requiredXP?: number;
      rank?: number;
    }): this;
    setLevel(level: number): this;
    setXP(xp: number, maxXp?: number): this;
    setRank(rank: number): this;
    setBanner(url: string): this;
    setField(key: string, value: unknown): this;
    
    // Discord.js v14 Methods
    reply(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: ReplyOptions): Promise<void>;
    followUp(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: FollowUpOptions): Promise<void>;
    send(channel: TextChannel | NewsChannel | DMChannel | ThreadChannel, options?: SendOptions): Promise<Message>;
  }

  // ==================== Welcome Card Builder ====================

  export class WelcomeCardBuilder extends CardBuilder {
    setUser(user: User | GuildMember): this;
    setWelcomeMessage(message: string): this;
    setMemberCount(count: number): this;
    incrementMemberCount(currentCount: number): this;
    setGuildName(name: string): this;
    setJoinDate(date: Date | string | number): this;
    setSubtitle(subtitle: string): this;
    
    // Discord.js v14 Methods
    reply(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: ReplyOptions): Promise<void>;
    followUp(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectInteraction, options?: FollowUpOptions): Promise<void>;
    send(channel: TextChannel | NewsChannel | DMChannel | ThreadChannel, options?: SendOptions): Promise<Message>;
  }

  // ==================== Types ====================

  export interface LeaderboardEntry {
    username: string;
    score?: number;
    level?: number;
    avatar?: string;
    rank?: number;
  }

  export interface ReplyOptions {
    filename?: string;
    ephemeral?: boolean;
    [key: string]: unknown;
  }

  export interface FollowUpOptions {
    filename?: string;
    ephemeral?: boolean;
    [key: string]: unknown;
  }

  export interface SendOptions {
    filename?: string;
    allowedMentions?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface LayoutNode {
    type: string;
    id?: string;
    props?: Record<string, unknown>;
    style?: Record<string, unknown>;
    children?: LayoutNode[];
    bounds?: LayoutBounds;
  }

  export interface LayoutBounds {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface ThemeDefinition {
    name?: string;
    colors?: ThemeColors;
    fonts?: ThemeFonts;
    spacing?: ThemeSpacing;
    effects?: ThemeEffects;
  }

  export interface ThemeColors {
    background?: {
      primary?: string;
      secondary?: string;
      card?: string;
    };
    text?: {
      primary?: string;
      secondary?: string;
      muted?: string;
    };
    accent?: {
      primary?: string;
      secondary?: string;
      glow?: string;
    };
    border?: {
      default?: string;
      highlight?: string;
    };
    status?: {
      online?: string;
      idle?: string;
      dnd?: string;
      offline?: string;
      streaming?: string;
    };
  }

  export interface ThemeFonts {
    primary?: string;
    secondary?: string;
    mono?: string;
    sizes?: Record<string, number>;
  }

  export interface ThemeSpacing {
    unit?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xxxl?: number;
  }

  export interface ThemeEffects {
    glowStrength?: number;
    borderRadius?: number;
    shadowBlur?: number;
    borderWidth?: number;
  }

  export type HookCallback = (context: Record<string, unknown>) => void | Promise<void>;

  // ==================== Other Exports ====================

  export class RenderPipeline {
    static execute(engine: Engine, layout: LayoutNode, data: Record<string, unknown>, options: RenderOptions): Promise<Buffer>;
  }

  export class CanvasRenderer extends EventEmitter {
    constructor(options?: { dpi?: number; maxPoolSize?: number });
    createContext(width: number, height: number, dpi?: number): RenderContext;
    releaseContext(context: RenderContext): void;
    applyEffect(ctx: CanvasRenderingContext2D, effect: Record<string, unknown>): Promise<void>;
    registerFont(path: string, family: string): void;
    clearPool(): void;
  }

  export class RenderContext {
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
    dpi: number;
    getDimensions(): { width: number; height: number; pixelWidth: number; pixelHeight: number };
  }

  export class AssetLoader {
    constructor(cache: LRUCache);
    loadImage(url: string): Promise<Image>;
    loadImages(urls: string[], options?: { throwOnError?: boolean }): Promise<{ results: Map<string, Image>; errors: Array<{ url: string; error: Error }> }>;
    load(asset: string | { type: string; src: string }): Promise<unknown>;
    preloadFromLayout(layout: LayoutNode): Promise<void>;
    extractImageUrls(node: LayoutNode): string[];
  }

  export class BufferManager {
    encode(canvas: Canvas, options?: RenderOptions): Promise<Buffer>;
  }

  export class LayoutParser {
    parse(layout: LayoutNode | string): LayoutNode;
    extractAssets(layout: LayoutNode): string[];
    validate(layout: LayoutNode): boolean;
    serialize(layout: LayoutNode): string;
  }

  export class LayoutResolver {
    resolve(layout: LayoutNode, container: { width: number; height: number }): LayoutNode;
  }

  export class StyleEngine {
    constructor(tokenEngine: TokenEngine);
    compute(layout: LayoutNode, theme: ThemeDefinition, tokens: Record<string, unknown>): Record<string, unknown>;
    merge(...styleObjects: Record<string, unknown>[]): Record<string, unknown>;
  }

  export class TokenEngine {
    define(name: string, value: unknown): void;
    defineBatch(tokens: Record<string, unknown>): void;
    defineComputed(name: string, resolver: (context: Record<string, unknown>, engine: TokenEngine) => unknown): void;
    get(name: string, context?: Record<string, unknown>, fallback?: unknown): unknown;
    resolve(context?: Record<string, unknown>): Record<string, unknown>;
    has(name: string): boolean;
    delete(name: string): void;
    clear(): void;
    clone(): TokenEngine;
    keys(): string[];
  }

  export class BaseComponent {
    constructor(type: string, props?: Record<string, unknown>);
    setStyle(style: Record<string, unknown>): this;
    on(event: string, callback: HookCallback): this;
    render(ctx: CanvasRenderingContext2D, bounds: LayoutBounds, styles: Record<string, unknown>, tokens: Record<string, unknown>): Promise<unknown>;
  }

  export class ComponentRegistry {
    register(name: string, ComponentClass: typeof BaseComponent): void;
    get(name: string): typeof BaseComponent | undefined;
    has(name: string): boolean;
    create(name: string, props?: Record<string, unknown>): BaseComponent;
    list(): string[];
  }

  export class ThemeManager {
    register(name: string, theme: ThemeDefinition, base?: string | null): void;
    get(name: string): ThemeDefinition | undefined;
    getActive(): ThemeDefinition;
    setActive(name: string): boolean;
    has(name: string): boolean;
    list(): string[];
    extend(baseName: string, newName: string, overrides: ThemeDefinition): ThemeDefinition;
  }

  export class BaseTheme {
    constructor(definition?: ThemeDefinition);
    getColors(): ThemeColors | undefined;
    getFonts(): ThemeFonts | undefined;
    getSpacing(): ThemeSpacing | undefined;
    getEffects(): ThemeEffects | undefined;
    getColor(path: string, fallback?: unknown): unknown;
    export(): ThemeDefinition;
  }

  export interface Plugin {
    name: string;
    install?: (engine: Engine) => void;
    uninstall?: (engine: Engine) => void;
    components?: Record<string, typeof BaseComponent>;
    themes?: Record<string, ThemeDefinition>;
    hooks?: Record<string, HookCallback>;
  }

  export class PluginManager extends EventEmitter {
    constructor(engine: Engine);
    register(plugin: Plugin): void;
    unregister(name: string): void;
    get(name: string): Plugin | undefined;
    has(name: string): boolean;
    list(): string[];
    registerHook(event: string, callback: HookCallback): void;
    emitHook(event: string, data: unknown): void;
  }

  export class BasePlugin {
    constructor(name: string);
    install(engine: Engine): void;
    uninstall(engine: Engine): void;
    registerComponent(name: string, ComponentClass: typeof BaseComponent): void;
    registerTheme(name: string, theme: ThemeDefinition): void;
    registerHook(event: string, callback: HookCallback): void;
  }

  export class LRUCache<T = unknown> {
    constructor(options?: { maxSize?: number; ttl?: number });
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    size(): number;
    keys(): string[];
  }

  export class AssetCache extends LRUCache<Image> {}

  // Predefined Themes
  export const cyberpunkTheme: ThemeDefinition;
  export const neonTheme: ThemeDefinition;
  export const darkTheme: ThemeDefinition;
  export const midnightTheme: ThemeDefinition;

  // Factory Function
  export function createEngine(options?: EngineOptions): Engine;
}
