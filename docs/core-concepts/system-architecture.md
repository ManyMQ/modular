# System Architecture

This document describes the high-level design of `@reformlabs/modular` — how the subsystems are organized, what each layer does, and how data flows from a builder call to a rendered `Buffer`.

---

## Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Public API Layer                       │
│   RankCard  ProfileCard  MusicCard  Leaderboard  ...        │
│   createEngine()   createTheme()   getAvailableThemes()     │
└───────────────────────┬─────────────────────────────────────┘
                        │  fluent builder calls
┌───────────────────────▼─────────────────────────────────────┐
│                    Builder Layer                             │
│   CardBuilder (base)   ← extended by each card builder      │
│   setUser / setStats / setTheme / render / reply / send     │
└───────────────────────┬─────────────────────────────────────┘
                        │  Engine.render(layout, data, opts)
┌───────────────────────▼─────────────────────────────────────┐
│                    Engine Layer                              │
│   Engine (EventEmitter)                                     │
│   ├── ThemeManager       — theme registry + inheritance     │
│   ├── TokenEngine        — design token resolution          │
│   ├── StyleEngine        — token → computed styles          │
│   ├── LayoutParser       — layout DSL → node tree           │
│   ├── LayoutResolver     — node tree → absolute bounds      │
│   ├── ComponentRegistry  — type name → renderer class       │
│   ├── AssetLoader        — URL → image (LRU cached)         │
│   ├── BufferManager      — canvas → Buffer (png/jpg/webp)   │
│   ├── PluginManager      — plugin lifecycle                 │
│   └── LRUCache           — shared asset cache               │
└───────────────────────┬─────────────────────────────────────┘
                        │  RenderPipeline.execute()
┌───────────────────────▼─────────────────────────────────────┐
│                  Render Pipeline (9 phases)                  │
│  1. Layout Resolve   2. Token Resolve   3. Style Resolve    │
│  4. Asset Preload    5. Pre-Render Hooks                     │
│  6. Component Render 7. FX Pass         8. Post-Render Hooks │
│  9. Export Encode                                            │
└───────────────────────┬─────────────────────────────────────┘
                        │  component.render(ctx, bounds, ...)
┌───────────────────────▼─────────────────────────────────────┐
│                   Canvas Layer                               │
│   Card Renderers (per type)                                  │
│   ├── RankCardRenderer     ProfileCardRenderer               │
│   ├── MusicCardRenderer    WelcomeCardRenderer               │
│   ├── LeaderboardCardRenderer   InviteCardRenderer           │
│   └── Generic: TextComponent  AvatarComponent  ...          │
│   Themes / Tokens / Styling                                  │
│   ├── ThemeManager   themes/index.js   legacy.js            │
│   └── StyleEngine    TokenEngine                            │
└───────────────────────┬─────────────────────────────────────┘
                        │  @napi-rs/canvas
┌───────────────────────▼─────────────────────────────────────┐
│                    Native Canvas                             │
│   @napi-rs/canvas — Rust-backed, near-native performance    │
└─────────────────────────────────────────────────────────────┘
```

---

## Source Directory Map

```
src/
├── index.ts                   ← Public API, all exports
├── errors/
│   └── ModularError.js        ← ValidationError, ComponentError, ModularError
│
├── core/
│   ├── Engine.js              ← Central orchestrator (EventEmitter)
│   ├── EngineOptions.ts       ← TypeScript types for EngineOptions
│   ├── RenderPipeline.js      ← 9-phase static pipeline class
│   ├── CardBuilder.js         ← Base fluent builder
│   ├── ComponentRegistry.js   ← type name → class map
│   │
│   ├── RankCardBuilder.js     ← thin wrappers (decorate pattern)
│   ├── ProfileCardBuilder.js
│   ├── MusicCardBuilder.js
│   ├── LeaderboardCardBuilder.js
│   ├── InviteCardBuilder.js
│   └── WelcomeCardBuilder.js
│
│   ├── cache/
│   │   └── LRUCache.js
│   │
│   ├── plugins/
│   │   └── PluginManager.js
│   │
│   └── internal/              ← Domain logic (not part of public API)
│       ├── router.js          ← maps type string → Builder class
│       └── cards/
│           ├── rank/          controller / service / validation / index
│           ├── profile/       controller / service / validation / index
│           ├── music/         controller / service / validation / index
│           ├── leaderboard/   controller / service / validation / index
│           ├── invite/        controller / service / validation / index
│           └── welcome/       controller / service / validation / index
│
└── canvas/
    ├── engine/
    │   ├── CanvasRenderer.js  ← creates canvas context, applies effects
    │   ├── AssetLoader.js     ← URL → Buffer → canvas Image
    │   └── BufferManager.js   ← canvas → PNG/JPEG/WebP Buffer
    │
    ├── components/            ← Generic, reusable UI components
    │   ├── TextComponent.js
    │   ├── AvatarComponent.js
    │   ├── ProgressComponent.js
    │   ├── MediaComponent.js
    │   └── ContainerComponent.js
    │
    ├── renderers/             ← Per-card-type full renderers
    │   ├── RankCardRenderer.js
    │   ├── ProfileCardRenderer.js
    │   ├── MusicCardRenderer.js
    │   ├── LeaderboardCardRenderer.js
    │   ├── InviteCardRenderer.js
    │   └── WelcomeCardRenderer.js
    │
    ├── layout/
    │   ├── LayoutParser.js
    │   └── LayoutResolver.js
    │
    ├── styling/
    │   ├── StyleEngine.js
    │   └── TokenEngine.js
    │
    └── themes/
        ├── index.js           ← All 21 themes, registerDefaultThemes()
        ├── ThemeManager.js
        ├── BaseTheme.js
        ├── legacy.js          ← Original 16 legacy themes
        ├── minimal-developer.js
        ├── neon-tech.js
        ├── glass-modern.js
        ├── pink-gradient.js
        └── esport.js          ← Added in v2.1
```

---

## Domain Module Pattern

Each card type's domain logic lives in `src/core/internal/cards/<type>/` and follows a consistent 4-file pattern:

| File | Responsibility |
|:-----|:--------------|
| `index.js` | Re-exports; entry point for the router |
| `controller.js` | Decorates a builder class with card-specific setter methods |
| `service.js` | Pure business logic (computeProgress, normalizeStats, etc.) |
| `validation.js` | Option normalization, integer range checks, default values |

The `controller.js` files use the **decorate pattern**: they receive a builder class prototype and attach methods to it at module load time. This avoids inheritance chains while keeping builder code DRY.

```js
// Example: controller decorating a builder prototype
function decorate(BuilderClass) {
  BuilderClass.prototype.setStats = function(stats) {
    const normalized = normalizeStats(stats); // from service.js
    this.setData(normalized);
    return this;
  };
}
```

---

## Data Flow Example (RankCard)

```
new RankCard()
  .setUser(user)          → config.data = { username, avatar, ... }
  .setStats(stats)        → config.data = { level, xp, maxXp, progress, ... }
  .setTheme('neon-tech')  → config.theme = 'neon-tech'
  .render()
      │
      ▼
  CardBuilder._buildLayout()
      → resolves theme tokens from ThemeManager
      → merges layout + tokens + effects
      │
      ▼
  Engine.render(layout, data, options)
      → RenderPipeline.execute(engine, layout, data, options)
      │
      ├── Phase 1: LayoutParser.parse() + LayoutResolver.resolve()
      ├── Phase 2: themeToTokens('neon-tech') → flat token map
      ├── Phase 3: StyleEngine.compute()
      ├── Phase 4: AssetLoader.load(avatarURL) → cached Image
      ├── Phase 5: beforeRender hooks
      ├── Phase 6: RankCardRenderer.render(ctx, bounds, styles, tokens)
      ├── Phase 7: FX effects (glow, scanlines)
      ├── Phase 8: afterRender hooks
      └── Phase 9: BufferManager.encode(canvas, { format: 'png' })
          → Buffer
```

---

## Plugin Architecture

Plugins follow a standard interface:

```ts
interface ModularPlugin {
  name: string;
  install(engine: Engine): void;
}
```

Plugins are registered via `engine.use(plugin)` and have full access to the engine instance — they can register hooks, override components, define tokens, or listen to events.

```js
const metricsPlugin = {
  name: 'metrics',
  install(engine) {
    engine.on('render:complete', ({ duration }) => {
      metrics.recordRender(duration);
    });
    engine.onHook('beforeRender', async (ctx) => {
      ctx._startTime = Date.now();
    });
  }
};

engine.use(metricsPlugin);
```

---

## Dependency Graph

```
@reformlabs/modular
└── @napi-rs/canvas  (runtime dependency — Rust native canvas)

devDependencies (build/test only):
├── typescript
├── eslint + @typescript-eslint/*
├── prettier
└── discord.js  (for .reply()/.send() type checking)
```

The package has **one runtime dependency** — `@napi-rs/canvas`. All other features are implemented in pure JavaScript/TypeScript.
