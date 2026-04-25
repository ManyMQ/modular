# Engine API Reference

The `Engine` is the central orchestrator of `@reformlabs/modular`. It wires together all subsystems — rendering, theming, caching, components, plugins, and hooks — into a single, production-ready runtime.

---

## Import

```js
import { createEngine, Engine } from '@reformlabs/modular';
// CommonJS:
const { createEngine, Engine } = require('@reformlabs/modular');
```

---

## Creating an Engine

```js
const engine = createEngine({
  dpi: 2,          // DPI scaling: 1–4 (default: 2)
  debug: false,    // Enable debug logging
  cache: {
    maxSize: 128,  // Max cached assets (LRU)
    ttl: 60000     // Cache TTL in ms
  }
});
```

### `EngineOptions`

```ts
type EngineOptions = {
  dpi?: number;        // Canvas DPI scaling. Default: 2
  debug?: boolean;     // Enable debug mode. Default: false
  cache?: {
    maxSize?: number;  // LRU cache capacity (number of items). Default: 128
    ttl?: number;      // Time-to-live for cached assets in ms. Default: no expiry
  };
  renderer?: {
    dpi?: number;
    maxPoolSize?: number;
  };
};
```

---

## Card Factory Methods

Each method returns a pre-configured, chainable builder instance.

### `engine.createCard(type?)`

Generic factory. Pass a card type string, or omit for a blank `CardBuilder`.

```js
const card = engine.createCard('rank');  // → RankCardBuilder
const blank = engine.createCard();       // → CardBuilder
```

**Valid type strings:** `'rank'`, `'music'`, `'leaderboard'`, `'invite'`, `'profile'`, `'welcome'`

---

### `engine.createRankCard()`
```js
const buffer = await engine.createRankCard()
  .setUser(user)
  .setStats({ level: 10, xp: 4200, maxXp: 5000, rank: 3 })
  .setTheme('neon-tech')
  .render();
```

### `engine.createMusicCard()`
```js
const buffer = await engine.createMusicCard()
  .setUser(user)
  .setTrack({ title: 'Midnight City', artist: 'M83', duration: 243, currentTime: 61, isPlaying: true })
  .render();
```

### `engine.createLeaderboardCard()`
```js
const buffer = await engine.createLeaderboardCard()
  .setLeaderboard({
    title: 'Top Players',
    entries: [
      { rank: 1, username: 'Alpha', xp: 98000 },
      { rank: 2, username: 'Beta', xp: 84000 }
    ]
  })
  .render();
```

### `engine.createInviteCard()`
```js
const buffer = await engine.createInviteCard()
  .setUser(user)
  .setInvite({ invites: 47, valid: 40, rewards: 3, milestoneProgress: 47, milestoneMax: 50 })
  .render();
```

### `engine.createProfileCard()`
```js
const buffer = await engine.createProfileCard()
  .setUser(user)
  .setPrimaryColor([108, 123, 255])
  .setStatus('online')
  .render();
```

### `engine.createWelcomeCard()`
```js
const buffer = await engine.createWelcomeCard()
  .setUser(user)
  .setGuild(guild)
  .render();
```

---

## Theme System

### `engine.setTheme(name)`

Sets the **engine-wide default theme**. All cards created by this engine will use this theme unless overridden per-card.

```js
engine.setTheme('neon-tech');
```

### `engine.registerTheme(name, definition, base?)`

Registers a custom theme. Optionally extends an existing theme.

```js
engine.registerTheme('my-brand', {
  colors: {
    accent: { primary: '#e11d48', glow: 'rgba(225, 29, 72, 0.4)' }
  }
}, 'default'); // inherits everything from 'default' and overrides colors.accent
```

### `engine.extendTheme(baseName, newName, overrides)`

Creates a new theme derived from an existing one. Returns the merged theme object.

```js
const brandTheme = engine.extendTheme('neon-tech', 'neon-red', {
  colors: { accent: { primary: '#ff0040', secondary: '#ff4080' } }
});
```

### `engine.listThemes()`

Returns an array of all registered theme IDs.

```js
engine.listThemes();
// ['default', 'cyberpunk', 'neon-tech', 'glass-modern', ...]
```

---

## Token System

Design tokens are key-value pairs that themes resolve against. They provide a semantic layer between raw colors and rendered pixels.

### `engine.defineToken(name, value)`

Defines a single global token.

```js
engine.defineToken('accent.primary', '#ff6b6b');
```

### `engine.defineTokens(map)`

Defines multiple tokens at once.

```js
engine.defineTokens({
  'accent.primary': '#ff6b6b',
  'accent.glow': 'rgba(255, 107, 107, 0.4)',
  'text.primary': '#ffffff'
});
```

---

## Component System

### `engine.registerComponent(name, ComponentClass)`

Registers a custom component renderer under a given type name.

```js
class MyBadgeComponent {
  constructor(props) { this.props = props; }
  async render(ctx, bounds, styles, tokens) {
    // draw to ctx using bounds...
  }
}

engine.registerComponent('my-badge', MyBadgeComponent);
```

### `engine.overrideComponent(name, ComponentClass)`

Replaces an existing built-in component with a custom implementation.

```js
engine.overrideComponent('avatar', MyCustomAvatarComponent);
```

### `engine.listComponents()`

Returns an array of all registered component type names.

---

## Plugin System

### `engine.use(plugin)`

Registers a plugin. Plugins receive the engine instance and can hook into any phase.

```js
const logPlugin = {
  name: 'logger',
  install(engine) {
    engine.on('render:start', ({ preset }) => console.log(`Rendering: ${preset}`));
    engine.on('render:complete', ({ duration }) => console.log(`Done in ${duration}ms`));
  }
};

engine.use(logPlugin);
```

### `engine.listPlugins()`

Returns a string array of all registered plugin names.

---

## Hook System

Hooks allow you to intercept and modify the rendering pipeline at key stages.

### `engine.onHook(event, callback)`

| Event | When called |
|:------|:-----------|
| `'beforeRender'` | Before the component render pass begins |
| `'afterRender'` | After all components are rendered and FX applied |
| `'beforeComponent'` | Before each individual component is rendered |
| `'afterComponent'` | After each individual component is rendered |
| `'preLayout'` | Before layout is parsed and resolved |
| `'postLayout'` | After layout is resolved into absolute coordinates |

```js
// Watermark every card:
engine.onHook('afterRender', async ({ renderContext }) => {
  const ctx = renderContext.ctx;
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ffffff';
  ctx.font = '11px Inter';
  ctx.fillText('© ReformLabs', 12, 388);
  ctx.globalAlpha = 1.0;
});
```

---

## Cache Management

### `engine.clearCache()`

Clears all cached assets (images, fonts). Useful after dynamic content updates.

```js
engine.clearCache();
```

### `engine.getCacheStats()`

Returns `{ size, maxSize }` for the LRU cache.

```js
const { size, maxSize } = engine.getCacheStats();
console.log(`Cache: ${size}/${maxSize} items`);
```

---

## Events

`Engine` extends `EventEmitter`. The following events are emitted:

| Event | Payload | Description |
|:------|:--------|:-----------|
| `'render:start'` | `{ preset?, width, height }` | Emitted when rendering begins |
| `'render:complete'` | `{ buffer, duration }` | Emitted when rendering succeeds |
| `'render:error'` | `Error` | Emitted when rendering fails |

```js
engine.on('render:complete', ({ duration }) => {
  metrics.recordRenderTime(duration);
});
```

---

## Direct `render()` Method

For advanced use cases, call `engine.render()` directly with a layout definition.

```js
const buffer = await engine.render(
  {
    type: 'rank-card',
    props: {},
    children: []
  },
  { username: 'Alice', level: 5, xp: 1200, maxXp: 2000, rank: 1 },
  { width: 800, height: 400, dpi: 2, theme: 'cyberpunk', format: 'png' }
);
```

### `engine.renderPreset(preset, data, options)`

Convenience wrapper that creates a card from a preset name and renders it.

```js
const buffer = await engine.renderPreset('rank', userData, { theme: 'esport' });
```

---

## Utility

### `engine.getVersion()`
Returns the current package version string.

### `engine.listThemes()`
Returns all registered theme IDs.

### `engine.listComponents()`
Returns all registered component type names.

### `engine.listPlugins()`
Returns all registered plugin names.
