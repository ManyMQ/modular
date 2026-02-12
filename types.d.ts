declare module 'modique' {
    import { Canvas, SKRSContext2D as Context } from '@napi-rs/canvas';
    import { EventEmitter } from 'events';

    // ============ V2.0 NEW FRAMEWORK ============

    export interface EngineOptions {
        dpi?: number;
        renderer?: { maxPoolSize?: number };
        cache?: { imageCacheSize?: number; gradientCacheSize?: number; bufferCacheSize?: number };
        tokens?: Record<string, any>;
    }

    export interface LayoutNode {
        type: string; id?: string; class?: string;
        props?: Record<string, any>; style?: StyleDefinition;
        children?: LayoutNode[]; layout?: LayoutConfig;
    }

    export interface LayoutConfig {
        x?: number; y?: number; width?: number | string; height?: number | string;
        direction?: 'row' | 'column'; align?: 'start' | 'center' | 'end' | 'stretch';
        justify?: 'start' | 'center' | 'end' | 'between' | 'around';
        gap?: number | string; padding?: number | string;
    }

    export interface StyleDefinition {
        'background-color'?: string; 'background'?: string; color?: string;
        'font-size'?: number | string; 'font-weight'?: string | number; 'font-family'?: string;
        'text-align'?: 'left' | 'center' | 'right'; glow?: boolean | string;
        'glow-color'?: string; 'glow-blur'?: number; border?: { color: string; width: number };
        'border-radius'?: number | string; [key: string]: any;
    }

    export interface Theme {
        colors?: { primary?: string; secondary?: string; accent?: string; background?: string; surface?: string; 'text.primary'?: string; 'text.secondary'?: string; 'text.muted'?: string; border?: string; [key: string]: string | undefined };
        spacing?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number; base?: number };
        radius?: { none?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number; full?: number };
        typography?: { family?: { primary?: string; secondary?: string; mono?: string }; size?: Record<string, number>; weight?: Record<string, string | number> };
        effects?: { glow?: Record<string, { blur: number; spread?: number; color?: string }>; shadow?: Record<string, { x: number; y: number; blur: number; color: string }> };
    }

    export class TokenResolver {
        globals: Map<string, any>; locals: Map<string, any>[]; resolvers: Array<{ namespace: string; fn: Function }>;
        constructor(tokens?: Record<string, any>);
        setGlobals(tokens: Record<string, any>): void; pushScope(tokens?: Record<string, any>): void; popScope(): Map<string, any> | undefined;
        registerResolver(namespace: string, resolverFn: Function): void; resolve(tokenStr: string): any; resolveDeep(obj: any): any;
        alpha(color: string, alphaValue: number): string; darken(color: string, amount?: number): string; lighten(color: string, amount?: number): string;
    }

    export class StyleSheet { addRule(selector: string, styles: StyleDefinition): this; getStylesForElement(element: LayoutNode, resolver?: TokenResolver): StyleDefinition; }
    export class StyleEngine {
        tokenResolver: TokenResolver; globalStyles: StyleSheet; componentStyles: Map<string, StyleSheet>; animations: Map<string, any>;
        constructor(tokens?: Record<string, any>); setTokens(tokens: Record<string, any>): void; registerComponentStyles(componentType: string, stylesheet: StyleSheet): void;
        computeStyles(element: LayoutNode, context?: any): StyleDefinition;
        createCanvasGradient(ctx: Context, gradientDef: any, x: number, y: number, w: number, h: number): CanvasGradient | string;
    }

    export class LayoutParser { parse(layoutDef: LayoutNode | string, parentContext?: any): LayoutNode; applyTemplate(templateName: string, data: Record<string, any>): LayoutNode; interpolate(node: LayoutNode, data: Record<string, any>): LayoutNode; }

    export class FXLayer { name: string; enabled: boolean; blendMode: string; opacity: number; apply(ctx: Context, width: number, height: number): Promise<void>; }
    export class GlowEffect extends FXLayer { constructor(options?: { color?: string; intensity?: number; spread?: number; layers?: number }); }
    export class NoiseEffect extends FXLayer { constructor(options?: { intensity?: number; scale?: number; seed?: number }); }
    export class GradientOverlay extends FXLayer { constructor(options?: { type?: 'linear' | 'radial'; direction?: string; colors?: string[]; blendMode?: string }); }
    export class ShadowDepth extends FXLayer { constructor(options?: { depth?: number; color?: string; offset?: { x: number; y: number }; blur?: number }); }
    export class VignetteEffect extends FXLayer { constructor(options?: { intensity?: number; color?: string; radius?: number }); }
    export class ChromaticAberration extends FXLayer { constructor(options?: { shift?: number; intensity?: number }); }
    export class FXSystem {
        register(name: string, EffectClass: typeof FXLayer): void; create(name: string, options?: any): FXLayer;
        createPipeline(effects: Array<string | { name: string; options?: any }>): FXLayer[];
        applyPipeline(pipeline: FXLayer[], ctx: Context, width: number, height: number): Promise<void>;
    }

    export class PluginAPI {
        engine: ModiqueEngine; registerHook(name: string, callback: Function): void; executeHook(name: string, context: any): Promise<void>;
        registerComponent(name: string, ComponentClass: any): void; registerTheme(name: string, theme: Theme): void;
        registerEffect(name: string, EffectClass: typeof FXLayer): void; registerLayout(name: string, layoutDef: LayoutNode): void; defineToken(name: string, value: any): void;
    }

    export class ModiquePlugin { name: string; version: string; api: PluginAPI | null; constructor(name: string, version?: string); install(api: PluginAPI): void; uninstall(): void; onInstall(api: PluginAPI): void; onUninstall(): void; }
    export class PluginManager { plugins: Map<string, ModiquePlugin>; api: PluginAPI; use(plugin: ModiquePlugin | (new () => ModiquePlugin)): this; uninstall(name: string): void; has(name: string): boolean; get(name: string): ModiquePlugin | undefined; list(): ModiquePlugin[]; }
    export class GlowPackPlugin extends ModiquePlugin { constructor(); }
    export class ThemePackPlugin extends ModiquePlugin { constructor(themes: Record<string, Theme>); }

    export class LRUCache<T> { constructor(maxSize?: number); get(key: string): T | undefined; set(key: string, value: T): void; has(key: string): boolean; clear(): void; size(): number; }
    export class FontCache { loaded: Set<string>; isLoaded(family: string): boolean; markLoaded(family: string): void; }
    export class ImageCache extends LRUCache<any> { constructor(maxSize?: number); getOrLoad(url: string, loader: (url: string) => Promise<any>): Promise<any>; }
    export class GradientCache extends LRUCache<CanvasGradient> { constructor(maxSize?: number); createGradient(ctx: Context, config: any, x: number, y: number, w: number, h: number): CanvasGradient; }
    export class CacheManager { images: ImageCache; gradients: GradientCache; fonts: FontCache; buffers: LRUCache<Buffer>; constructor(options?: { imageCacheSize?: number; gradientCacheSize?: number; bufferCacheSize?: number }); clear(): void; stats(): { images: number; gradients: number; buffers: number }; }

    export class RenderContext { canvas: Canvas; ctx: Context; dpi: number; width: number; height: number; globalAlpha: number; save(): void; restore(): void; withOpacity(alpha: number, fn: () => void): void; }
    export class RendererCore extends EventEmitter {
        defaultDpi: number; canvasPool: Canvas[]; maxPoolSize: number;
        constructor(options?: { dpi?: number; maxPoolSize?: number });
        createContext(width: number, height: number, dpi?: number): RenderContext;
        releaseContext(context: RenderContext): void;
        renderToBuffer(renderFn: (ctx: RenderContext) => Promise<void>, width: number, height: number, format?: 'png' | 'jpeg'): Promise<Buffer>;
        renderBatch(jobs: any[]): Promise<Buffer[]>;
    }

    export class ComponentRegistry { components: Map<string, any>; register(name: string, ComponentClass: any): void; create(type: string, props?: any): any; has(type: string): boolean; list(): string[]; }

    export class ThemeRegistry {
        themes: Map<string, Theme>; baseTheme: Theme; constructor();
        register(name: string, theme: Theme, parent?: string | null): this;
        get(name: string): Theme; has(name: string): boolean;
        mergeThemes(parent: Theme, child: Theme): Theme; flattenTheme(theme: Theme, prefix?: string): Record<string, any>; getTokens(name: string): Record<string, any>;
        createVariant(baseTheme: string, variant: string, overrides: Theme): this; list(): string[];
    }

    export class ModiqueEngine extends EventEmitter {
        renderer: RendererCore; tokenResolver: TokenResolver; styleEngine: StyleEngine; layoutParser: LayoutParser; fxSystem: FXSystem;
        themeRegistry: ThemeRegistry; componentRegistry: ComponentRegistry; pluginManager: PluginManager; cache: CacheManager;
        currentTheme: string; hooks: Record<string, Function[]>;
        constructor(options?: EngineOptions);
        setTheme(name: string): this; getTheme(): string; registerTheme(name: string, theme: Theme, parent?: string | null): this;
        registerComponent(name: string, ComponentClass: any): this; overrideComponent(name: string, ComponentClass: any): this;
        use(plugin: ModiquePlugin | (new () => ModiquePlugin)): this; defineToken(name: string, value: any): this;
        registerLayout(name: string, layoutDef: LayoutNode): this; on(event: string, callback: Function): this;
        render(layoutDef: LayoutNode, options?: { width?: number; height?: number; data?: Record<string, any>; effects?: any[]; format?: 'png' | 'jpeg' | 'webp' }): Promise<Buffer>;
        renderBatch(jobs: any[]): Promise<Buffer[]>; createCard(): CardBuilder;
    }

    export class CardBuilder {
        engine: ModiqueEngine; layout: LayoutNode; options: { data: Record<string, any>; effects: any[]; dpi?: number };
        constructor(engine: ModiqueEngine); setSize(width: number, height: number): this; setDpi(dpi: number): this; setTheme(theme: string): this;
        setBackground(options: { type: 'solid' | 'gradient' | 'image'; color?: string; colors?: string[]; direction?: string; url?: string; fallback?: string }): this;
        setLayout(layoutDef: LayoutNode): this; useTemplate(templateName: string, data?: Record<string, any>): this;
        addToSlot(slot: 'header' | 'body' | 'footer', componentType: string, props: any): this; setData(data: Record<string, any>): this;
        setTokens(tokens: Record<string, any>): this; addEffect(effectName: string, options?: any): this; render(): Promise<Buffer>; renderToFile(path: string, format?: 'png' | 'jpeg'): Promise<this>;
    }

    export function createEngine(options?: EngineOptions): ModiqueEngine;
    export const cyberpunkTheme: Theme; export const neonTheme: Theme; export const darkTheme: Theme; export const midnightTheme: Theme;

    // ============ V1.x LEGACY ============

    export class HookManager {
        hooks: { beforeRender: Function[]; afterRender: Function[]; beforeComponentRender: Function[]; afterComponentRender: Function[] };
        constructor(); on(event: string, callback: Function): void; execute(event: string, context: any): Promise<void>;
    }

    export class TokenSystem extends TokenResolver {}

    export class ComponentRegistry {
        components: Map<string, any>; defaults: Map<string, any>;
        registerDefault(name: string, ComponentClass: any): void;
        override(name: string, ComponentClass: any): void;
        get(name: string, options?: any): any; reset(): void;
    }

    export interface ThemeV1 {
        colors: { accent: { primary: string; secondary: string; glow: string }; background: { primary: string; secondary: string; card: string }; text: { primary: string; secondary: string; muted: string }; border: { default: string; highlight: string } };
        fonts: { primary: string; secondary: string; sizes: Record<string, number> };
        spacing: { unit: number; xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
        effects: { glowStrength: number; borderRadius: number; shadowBlur: number };
    }

    export class AssetCache extends CacheManager {}

    export interface ComponentOptions {
        theme?: ThemeV1; tokens?: TokenSystem; cache?: AssetCache; dpi?: number;
    }

    export class BaseComponentV1 {
        theme: ThemeV1; tokens: TokenSystem; cache: AssetCache; dpi: number;
        constructor(options?: ComponentOptions);
        getToken(name: string): any; scale(v: number): number;
        setFont(ctx: Context, size: number, weight?: string, family?: string): void;
        measureText(ctx: Context, text: string, size: number, weight?: string): number;
        roundRect(ctx: Context, x: number, y: number, w: number, h: number, r: number): void;
        getColor(path: string, fallback?: string): string;
        render(ctx: Context, props: any): Promise<any>;
    }

    export class CardEngine extends ModiqueEngine {}

    export class CardBuilderV1 extends CardBuilder {}

    export class ProfileCard { constructor(engine: CardEngine); render(data: any): Promise<Buffer>; }
    export class LeaderboardCard { constructor(engine: CardEngine); render(data: any): Promise<Buffer>; }
    export class ServerRanksCard { constructor(engine: CardEngine); render(data: any): Promise<Buffer>; }
    export class MusicCard { constructor(engine: CardEngine); render(data: any): Promise<Buffer>; }
    export class InvitesCard { constructor(engine: CardEngine); render(data: any): Promise<Buffer>; }

    export class ModularCardBuilder {
        constructor(options?: { dpi?: number });
        buildServerRanks(data: { title?: string; users?: any[] }): Promise<Buffer>;
        buildInvites(data: { avatar?: string; invites?: number; nextReward?: number; rewardDescription?: string }): Promise<Buffer>;
        buildMusic(data: { trackName?: string; artist?: string; albumArt?: string; currentTime?: number; duration?: number; volume?: number }): Promise<Buffer>;
        buildProfile(data: { username?: string; discriminator?: string; avatar?: string; level?: number; rank?: number; currentXP?: number; requiredXP?: number }): Promise<Buffer>;
        buildServerStats(data: { username?: string; avatar?: string; level?: number; rank?: number; discordJoinDate?: string; serverJoinDate?: string }): Promise<Buffer>;
        buildLeaderboard(data: { serverName?: string; subtitle?: string; users?: any[] }): Promise<Buffer>;
    }

    export const modique: typeof createEngine;
}
