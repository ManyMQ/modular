# Render Pipeline

The `RenderPipeline` is a 9-phase static orchestrator that converts a card builder configuration into a PNG/JPEG/WebP `Buffer`. Understanding these phases helps you write efficient hooks and debug render issues.

---

## Pipeline Phases

```
Builder.render()
    │
    ▼
┌─────────────────────────────────────────────┐
│  Phase 1: Layout Resolve                    │
│  Parse layout DSL → absolute coordinates    │
├─────────────────────────────────────────────┤
│  Phase 2: Token Resolve                     │
│  Active theme → flat token map              │
├─────────────────────────────────────────────┤
│  Phase 3: Style Resolve                     │
│  Tokens → computed visual styles            │
├─────────────────────────────────────────────┤
│  Phase 4: Asset Preload                     │
│  URLs → LRU cache (parallel)                │
├─────────────────────────────────────────────┤
│  Phase 5: Pre-Render Hooks                  │
│  engine.onHook('beforeRender', ...)         │
├─────────────────────────────────────────────┤
│  Phase 6: Component Render Pass             │
│  Walk layout tree → draw to canvas          │
├─────────────────────────────────────────────┤
│  Phase 7: FX Pass                           │
│  Post-process effects (glow, scanlines)     │
├─────────────────────────────────────────────┤
│  Phase 8: Post-Render Hooks                 │
│  engine.onHook('afterRender', ...)          │
├─────────────────────────────────────────────┤
│  Phase 9: Export Encode                     │
│  Canvas → Buffer (PNG/JPEG/WebP)            │
└─────────────────────────────────────────────┘
```

---

## Phase 1: Layout Resolve

The `LayoutParser` converts the layout definition (created by the card builder) into a normalized tree. The `LayoutResolver` then computes absolute pixel positions and sizes for every node.

```js
// Layout input (from builder internals):
{
  type: 'rank-card',
  props: {},
  children: [],
  width: 800,
  height: 400
}

// Resolved output (absolute bounds):
{
  type: 'rank-card',
  bounds: { x: 0, y: 0, width: 800, height: 400 },
  children: [...]
}
```

**Hooks:** `preLayout`, `postLayout`

---

## Phase 2: Token Resolve

The active theme (set via `.setTheme()`) is flattened into a dot-path token map. Layout-level token overrides (from `.setTokens()`) are merged on top. Data fields (e.g., `username`, `xp`) are also merged so they can be referenced from layout DSL.

```js
// Resulting token map:
{
  'colors.surface.primary': '#050505',
  'colors.accent.primary': '#00f0ff',
  'username': 'Alice',
  'xp': 4200,
  // ...
}
```

---

## Phase 3: Style Resolve

The `StyleEngine` maps the flat token map to a structured **computed styles** object that components can consume without knowing about the theme structure.

---

## Phase 4: Asset Preload

All image URLs referenced in the layout (avatars, banners, album art, custom badges) are extracted and loaded in **parallel** into the `LRUCache`. This prevents sequential load delays during the render pass.

```js
// All images preloaded before a single pixel is drawn:
await Promise.all(assets.map(asset => engine.assetLoader.load(asset)));
```

If an asset fails to load, it is noted as an error but does not abort the render — the renderer substitutes a placeholder.

---

## Phase 5: Pre-Render Hooks

`beforeRender` hooks fire here. Use these to modify the pipeline `context` before any drawing begins.

```js
engine.onHook('beforeRender', async (context) => {
  // Inject computed data:
  context.data.serverMemberCount = await db.getMemberCount();
});
```

---

## Phase 6: Component Render Pass

The resolved layout tree is walked recursively. For each node:

1. `engine.componentRegistry.get(type)` retrieves the renderer class.
2. An instance is created with the node's props + data.
3. `beforeComponent` hooks fire.
4. `component.render(ctx, bounds, styles, tokens)` draws to the canvas.
5. `afterComponent` hooks fire.
6. Children are rendered recursively.

```js
// Per-component hook — add debug outlines:
engine.onHook('beforeComponent', async ({ component, bounds }) => {
  if (process.env.DEBUG_BOUNDS) {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }
});
```

If a component type is not registered, a `ComponentError` is thrown with a descriptive message and the missing type name.

---

## Phase 7: FX Pass

Global post-processing effects from `.addEffect()` / the theme's `effects` block are applied after all components are drawn. Examples:

- **glow** — canvas shadow blur overlay
- **scanlines** — horizontal line overlay (CRT effect)
- **vignette** — edge darkening
- **noise** — grain overlay

```js
// Add a custom glow effect:
new RankCard()
  .addEffect('glow', { color: '#00f0ff', blur: 30 })
  .render();
```

---

## Phase 8: Post-Render Hooks

`afterRender` hooks fire here with access to the live `renderContext` (canvas + ctx). Ideal for watermarks, audit logging, or final pixel-level modifications.

```js
engine.onHook('afterRender', async ({ renderContext }) => {
  // Log render metrics
  analytics.track('card_rendered');
});
```

---

## Phase 9: Export Encode

The canvas is encoded to the requested format and returned as a `Buffer`.

```js
// Default: PNG
const pngBuffer = await card.render();

// JPEG with quality control:
const jpegBuffer = await card.render({ format: 'jpeg', quality: 0.85 });

// WebP:
const webpBuffer = await card.render({ format: 'webp', quality: 0.9 });
```

| Format | Quality Range | Notes |
|:-------|:-------------|:------|
| `png` | N/A (lossless) | Default, best quality |
| `jpeg` | 0.0–1.0 | Smaller files, no transparency |
| `webp` | 0.0–1.0 | Best compression/quality tradeoff |

---

## Memory Safety

As of v2.1, the `renderContext` (which holds the native canvas allocation) is **guaranteed** to be released in a `finally` block after every render — even if FX or post-hooks throw:

```js
try {
  // FX Pass
  // Post Hooks
  // Export Encode
  return buffer;
} finally {
  renderContext.release(); // always runs
}
```

This prevents canvas memory leaks in long-running bot processes.

---

## Error Types

| Error Class | Thrown When |
|:-----------|:-----------|
| `ValidationError` | Invalid options passed to a builder setter |
| `ComponentError` | Unknown component type in the layout tree |
| `ModularError` | Base class for all library errors |

```js
import { ModularError } from '@reformlabs/modular';

try {
  await card.render();
} catch (err) {
  if (err instanceof ModularError) {
    console.error(`[modular] ${err.name}: ${err.message}`);
  }
}
```

---

## Bypassing the Builder (Advanced)

For maximum control, call the pipeline directly:

```js
const buffer = await engine.render(
  // Layout definition:
  { type: 'rank-card', props: {}, children: [], width: 800, height: 400 },
  // Data:
  { username: 'Alice', level: 12, xp: 4200, maxXp: 5000, rank: 3, avatar: '...' },
  // Options:
  { dpi: 2, theme: 'neon-tech', format: 'png' }
);
```
