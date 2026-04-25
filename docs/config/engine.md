# Engine Configuration Reference

This page documents every option accepted by `createEngine(options)`.

---

## Import

```js
import { createEngine } from '@reformlabs/modular';
// CommonJS:
const { createEngine } = require('@reformlabs/modular');
```

---

## `EngineOptions`

```ts
type EngineOptions = {
  dpi?: number;
  debug?: boolean;
  cache?: CacheOptions;
  renderer?: RendererOptions;
} & Record<string, unknown>;

type CacheOptions = {
  maxSize?: number;
  ttl?: number;
};

type RendererOptions = {
  dpi?: number;
  maxPoolSize?: number;
};
```

---

## Options Reference

### `dpi`

| Type | Default | Range |
|:-----|:--------|:------|
| `number` | `2` | `1`–`4` |

Canvas DPI scaling factor. The `width` and `height` you pass to `setSize()` are **logical pixels**. The actual canvas pixel dimensions are:

```
physical width  = logical width  × dpi
physical height = logical height × dpi
```

**Examples:**
- `dpi: 1` → 800 × 400 px canvas (fastest, smallest files)
- `dpi: 2` → 1600 × 800 px canvas (default — retina-ready for Discord)
- `dpi: 4` → 3200 × 1600 px canvas (print quality)

```js
const engine = createEngine({ dpi: 2 });
```

> Individual card builders can also override DPI via `.setDpi(n)` or `card.render({ dpi: n })`.

---

### `debug`

| Type | Default |
|:-----|:--------|
| `boolean` | `false` |

Enables debug mode. When `true`, the renderer emits additional telemetry events that you can listen to for troubleshooting:

```js
const engine = createEngine({ debug: true });
engine.on('render:start', (data) => console.log('Render started:', data));
engine.on('render:complete', (data) => console.log('Done in', data.duration, 'ms'));
engine.on('render:error', (err) => console.error('Render failed:', err));
```

---

### `cache`

| Type | Default |
|:-----|:--------|
| `CacheOptions` | `{ maxSize: 128 }` |

Configures the **LRU asset cache** used by `AssetLoader`. Loaded images (avatars, banners, album art) are cached here to avoid re-fetching on repeated renders.

#### `cache.maxSize`

| Type | Default | Unit |
|:-----|:--------|:-----|
| `number` | `128` | number of items |

Maximum number of assets to hold in cache. When the limit is reached, the least-recently-used entry is evicted.

**Recommended values by bot scale:**

| Bot Size | `maxSize` |
|:---------|:---------|
| < 1k users | `64` |
| 1k–10k users | `128` (default) |
| 10k–100k users | `256`–`512` |
| 100k+ | `512`+ with external image proxy |

#### `cache.ttl`

| Type | Default | Unit |
|:-----|:--------|:-----|
| `number` | no expiry | milliseconds |

Time-to-live for cached assets. Assets older than this are evicted on next access. Omit to disable TTL-based eviction.

```js
const engine = createEngine({
  cache: {
    maxSize: 256,
    ttl: 300_000  // 5 minutes
  }
});
```

---

### `renderer`

| Type | Default |
|:-----|:--------|
| `RendererOptions` | `{ maxPoolSize: 10 }` |

Canvas renderer-level settings.

#### `renderer.maxPoolSize`

| Type | Default |
|:-----|:--------|
| `number` | `10` |

Maximum number of canvas contexts held in the internal context pool. Increase for very high-concurrency workloads.

#### `renderer.dpi`

Per-renderer DPI override (falls back to the top-level `dpi` option).

---

## Monitoring Cache

```js
// Check cache usage at runtime:
const { size, maxSize } = engine.getCacheStats();
console.log(`Asset cache: ${size}/${maxSize}`);

// Clear the cache manually:
engine.clearCache();
```

---

## Full Example

```js
import { createEngine } from '@reformlabs/modular';

const engine = createEngine({
  dpi: 2,
  debug: false,
  cache: {
    maxSize: 256,
    ttl: 300_000  // expire cached assets after 5 minutes
  },
  renderer: {
    maxPoolSize: 20
  }
});

// Monitor renders:
engine.on('render:complete', ({ duration }) => {
  if (duration > 150) console.warn(`Slow render: ${duration}ms`);
});

// Use the engine across all commands — never recreate it per request:
export { engine };
```

---

## Related

- [Engine API Reference](../api/engine.md) — Full Engine class method reference
- [Performance Guide](../guides/performance.md) — Cache tuning, concurrency, DPI strategies
- [Builder Configuration](./builder.md) — Per-card size, DPI, and format options
