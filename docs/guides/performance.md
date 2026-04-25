# Performance & Scaling

`@reformlabs/modular` is designed for production bot workloads. This guide covers configuration strategies and benchmarks to help you achieve optimal throughput.

---

## Benchmark Results

Measured on Node.js v24.11.1, 20 iterations per card type, DPI 2, PNG output:

| Card Type    | Avg Render Time | Total (20x) |
|:-------------|:---------------|:------------|
| Profile      | **43.9 ms**    | 878 ms      |
| Music        | 60.0 ms        | 1200 ms     |
| Rank         | 70.1 ms        | 1403 ms     |
| Welcome      | 71.5 ms        | 1430 ms     |
| Invite       | 75.0 ms        | 1501 ms     |
| Leaderboard  | 95.7 ms        | 1914 ms     |

> Benchmarks generated via `npm run smoke` / `scripts/smoke-test.js`. Run `npm test` to reproduce.

---

## 1. Reuse the Engine (Critical)

**Never create a new engine per request.** The engine initializes fonts, registers themes, and sets up the LRU cache — doing this per request is ~10× slower.

```js
// ✅ CORRECT — Create once, reuse forever
import { createEngine } from '@reformlabs/modular';

const engine = createEngine({ dpi: 2 });

export async function handleRankCommand(interaction) {
  const buffer = await engine.createRankCard()
    .setUser(interaction.user)
    .setStats(await db.getStats(interaction.user.id))
    .render();
  // ...
}
```

```js
// ❌ WRONG — Creates a new engine every request
export async function handleRankCommand(interaction) {
  const engine = createEngine(); // slow!
  // ...
}
```

> The standalone builder classes (`new RankCard()`) automatically use a global singleton engine internally — they are safe for simple bots.

---

## 2. Tune the LRU Cache

The engine caches loaded images (avatars, banners, album art) in an LRU cache. Tune `maxSize` based on your bot's active user set:

```js
const engine = createEngine({
  cache: {
    maxSize: 256,    // number of cached assets (default: 128)
    ttl: 300_000     // 5 minutes in ms (default: no expiry)
  }
});
```

| Bot Size | Recommended `maxSize` |
|:---------|:----------------------|
| < 1k users | 64 |
| 1k–10k users | 128 (default) |
| 10k–100k users | 256–512 |
| 100k+ users | 512+ with external image proxy |

### Monitor cache hit rate

```js
setInterval(() => {
  const { size, maxSize } = engine.getCacheStats();
  console.log(`Cache: ${size}/${maxSize} items`);
}, 60_000);
```

---

## 3. Concurrency: Non-Blocking Renders

Each `.render()` call is async and non-blocking. Run multiple renders in parallel:

```js
// Render all leaderboard user cards in parallel:
const buffers = await Promise.all(
  topUsers.map(user =>
    engine.createRankCard()
      .setUser(user)
      .setStats(user.stats)
      .render()
  )
);
```

> **Warning:** Unlimited concurrency can exhaust memory. For high-volume bots, use a queue (e.g., `p-limit`) to cap concurrent renders:

```js
import pLimit from 'p-limit';

const limit = pLimit(8); // max 8 concurrent renders

const buffers = await Promise.all(
  users.map(user => limit(() => engine.createRankCard().setUser(user).render()))
);
```

---

## 4. Reduce DPI for Non-Display Uses

DPI 2 is the default (retina displays). For thumbnails, logs, or non-display uses, DPI 1 is ~4× faster to encode:

```js
// Thumbnail generation:
const buffer = await engine.createRankCard()
  .setUser(user)
  .setStats(stats)
  .setDpi(1)  // 2× faster render + 4× smaller file
  .render();
```

---

## 5. Output Format Strategy

| Use Case | Format | Notes |
|:---------|:-------|:------|
| Discord embeds | `png` (default) | Lossless, transparency support |
| Bulk storage | `jpeg` | 60–80% smaller than PNG, no transparency |
| Web thumbnails | `webp` | Best compression/quality ratio |

```js
// JPEG for storage:
const buffer = await card.render({ format: 'jpeg', quality: 0.85 });

// WebP for web:
const buffer = await card.render({ format: 'webp', quality: 0.9 });
```

---

## 6. Use Render Hooks for Metrics

Track slow renders without modifying card logic:

```js
engine.on('render:complete', ({ duration }) => {
  if (duration > 200) {
    logger.warn(`Slow render: ${duration}ms`);
  }
  metrics.histogram('render_duration_ms', duration);
});
```

---

## 7. Profile Render Bottlenecks

Run the built-in performance script:

```bash
npm run smoke
```

This executes `scripts/smoke-test.js`, renders each card type 20 times, and writes results to `perf-current.json`. Compare against `perf-baseline.json` to detect regressions.

---

## 8. Cache-Warm on Startup

Pre-load frequently used avatars (e.g., bot avatar, server icon) at startup to eliminate first-render latency:

```js
// On bot ready:
client.once('ready', async () => {
  await engine.assetLoader.load(client.user.displayAvatarURL({ size: 256 }));
  logger.info('Engine asset cache warmed');
});
```

---

## 9. Memory Management

- The engine holds a single `LRUCache` shared across all renders.
- As of v2.1, every render's native canvas context is `release()`d in a `finally` block — no manual cleanup needed.
- For very long-running processes (> 24h), call `engine.clearCache()` periodically to prevent stale assets from consuming memory:

```js
// Clear cache every 6 hours:
setInterval(() => {
  engine.clearCache();
  logger.info('Engine cache cleared');
}, 6 * 60 * 60 * 1000);
```

---

## 10. Run the Benchmark

```bash
# Install dependencies:
npm install

# Build:
npm run build

# Run smoke benchmark:
npm run smoke

# Results written to:
# perf-current.json
```