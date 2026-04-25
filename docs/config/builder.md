# Builder Configuration Reference

This page covers the dimension, DPI, and output format options available on every builder in `@reformlabs/modular`.

---

## Dimensions

Every builder defaults to `800 × 400` logical pixels at DPI 2 (resulting in a `1600 × 800` physical canvas).

### `setSize(width, height)`

Permanently changes the card dimensions for this builder instance. All subsequent `.render()` calls use these dimensions.

```js
card.setSize(930, 280);
```

| Parameter | Type | Range | Description |
|:----------|:-----|:------|:-----------|
| `width` | `number` | 1–4096 | Logical card width in pixels |
| `height` | `number` | 1–4096 | Logical card height in pixels |

Throws `ValidationError` if either value is outside 1–4096.

### `render({ width, height })` — per-call override

Override dimensions for a single render without mutating the builder:

```js
// Builder stays at default 800×400, but this render uses 930×280:
const buffer = await card.render({ width: 930, height: 280 });
```

---

## Priority Order

When determining the canvas size, the engine applies the following precedence (highest first):

```
render({ width, height })   ← highest priority (single call override)
        ↓
card.setSize(width, height) ← builder-level persistent setting
        ↓
Engine default (800 × 400)  ← fallback
```

---

## DPI Scaling

DPI controls the ratio between **logical pixels** (the values you pass to `setSize`) and **physical pixels** on the canvas. Higher DPI produces crisper images on retina displays.

```
physical width  = logical width  × DPI
physical height = logical height × DPI
```

| DPI | Use Case | File Size |
|:----|:---------|:---------|
| `1` | Thumbnails, bulk generation | Smallest |
| `2` | Discord (default) — retina-ready | Moderate |
| `3` | High-resolution exports | Large |
| `4` | Print-quality | Largest |

### `setDpi(dpi)`

Sets DPI persistently for this builder:

```js
card.setDpi(2); // default
card.setDpi(1); // faster, smaller output
```

Throws `ValidationError` if value is outside 1–4.

### `render({ dpi })` — per-call override

```js
const buffer = await card.render({ dpi: 1 }); // fast, one-off thumbnail
```

---

## Output Format

By default `.render()` encodes the canvas as a lossless **PNG**. Override per call:

```js
const png  = await card.render();                            // PNG (default)
const jpg  = await card.render({ format: 'jpeg', quality: 0.85 });
const webp = await card.render({ format: 'webp', quality: 0.9 });
```

| Format | `quality` | Transparency | Notes |
|:-------|:----------|:------------|:------|
| `'png'` | N/A (lossless) | ✅ | Default, best for Discord |
| `'jpeg'` | 0.0–1.0 | ❌ | Smallest files |
| `'webp'` | 0.0–1.0 | ✅ | Best compression/quality ratio |

---

## Examples

### Fixed dimensions with DPI 2 (standard Discord use)

```js
import { ProfileCard } from '@reformlabs/modular';

const buffer = await new ProfileCard()
  .setSize(885, 303)
  .setDpi(2)
  .setTheme('glass-modern')
  .render();
```

### Per-call dimension override

```js
import { RankCard } from '@reformlabs/modular';

const card = new RankCard()
  .setUser(user)
  .setStats(stats)
  .setTheme('cyberpunk');

// Normal render:
const standard = await card.render();

// Thumbnail render (no mutation):
const thumb = await card.render({ width: 400, height: 200, dpi: 1 });
```

### JPEG for storage efficiency

```js
const buffer = await new RankCard()
  .setUser(user)
  .setStats(stats)
  .render({ format: 'jpeg', quality: 0.85 });
```

### All options combined

```js
const buffer = await card.render({
  width: 930,
  height: 280,
  dpi: 2,
  format: 'webp',
  quality: 0.92
});
```

---

## Related

- [Engine Configuration](./engine.md) — DPI defaults and cache options at the engine level
- [Performance Guide](../guides/performance.md) — When to use DPI 1 vs DPI 2
- [CardBuilder API](../api/card-builder.md) — Full base builder method reference
