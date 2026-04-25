# Render Engine API Reference

![Documentation](../assets/@modulardocumentation.png)

[← Back: Theme Engine API](./theme-engine.md)

---

The Render Engine provides low-level control over the canvas. Most developers use the fluent builder API and never need to touch these classes directly. They are intended for **plugin authors**, **custom component builders**, and **advanced integrations**.

---

## `CanvasRenderer`

Accessed via `engine.renderer`.

### `.createContext(width, height, dpi)` → `RenderContext`

Creates a new `RenderContext` backed by a fresh `@napi-rs/canvas` instance.

| Parameter | Type | Description |
|:----------|:-----|:-----------|
| `width` | `number` | Logical width in pixels |
| `height` | `number` | Logical height in pixels |
| `dpi` | `number` | DPI scaling multiplier |

```js
const renderCtx = engine.renderer.createContext(800, 400, 2);
// Physical canvas: 1600×800 pixels
```

---

### `.applyEffect(ctx, effectConfig)` → `Promise<void>`

Applies a single post-processing effect to a live canvas 2D context.

| Parameter | Type | Description |
|:----------|:-----|:-----------|
| `ctx` | `CanvasRenderingContext2D` | The 2D context to draw onto |
| `effectConfig` | `Object` | Effect descriptor |

```ts
effectConfig: {
  type: 'glow' | 'blur' | 'shadow' | 'gradient' | string;
  color?: string;   // For glow/shadow effects
  blur?: number;    // Blur radius
  opacity?: number; // Effect opacity
  [key: string]: any;
}
```

```js
// Apply a cyan glow effect manually:
await engine.renderer.applyEffect(renderCtx.ctx, {
  type: 'glow',
  color: '#00f0ff',
  blur: 30
});
```

---

## `RenderContext`

The surface object returned by `CanvasRenderer.createContext()`. Holds the canvas and 2D context for a single render.

### Properties

| Property | Type | Description |
|:---------|:-----|:-----------|
| `canvas` | `Canvas` | The `@napi-rs/canvas` Canvas instance |
| `ctx` | `CanvasRenderingContext2D` | The 2D drawing context |

The `ctx` implements the standard [Web Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) — all standard methods (`fillRect`, `drawImage`, `fillText`, etc.) work as expected.

### `.release()` → `void`

Releases the native canvas allocation back to the engine's pool. **Always call this when you are done with the context.** In the standard render pipeline this is called automatically in a `finally` block.

```js
const renderCtx = engine.renderer.createContext(800, 400, 2);
try {
  // draw...
  const buffer = await engine.bufferManager.encode(renderCtx.canvas, { format: 'png' });
  return buffer;
} finally {
  renderCtx.release(); // guaranteed, even on error
}
```

---

## `AssetLoader`

Accessed via `engine.assetLoader`. Handles remote image retrieval with LRU caching.

### `.load(url)` → `Promise<Image>`

Loads an image from a URL (or file path) and returns an `@napi-rs/canvas` `Image` object ready for `ctx.drawImage()`. Results are cached in the engine's LRU cache.

```js
const img = await engine.assetLoader.load('https://cdn.discordapp.com/avatars/123/abc.png');
renderCtx.ctx.drawImage(img, 20, 20, 80, 80);
```

If loading fails (network error, invalid URL), the error is recorded and `null` is returned — it does not throw, preventing a single bad URL from aborting the render.

### `.clearErrors()` → `void`

Clears the recorded error list for failed assets without clearing the image cache.

```js
engine.assetLoader.clearErrors();
```

---

## `BufferManager`

Accessed via `engine.bufferManager`. Encodes a canvas to a `Buffer`.

### `.encode(canvas, options)` → `Promise<Buffer>`

```ts
options: {
  format?: 'png' | 'jpeg' | 'webp'; // default: 'png'
  quality?: number;                 // 0.0–1.0, for jpeg/webp
}
```

```js
const buffer = await engine.bufferManager.encode(renderCtx.canvas, { format: 'png' });
const jpeg = await engine.bufferManager.encode(renderCtx.canvas, { format: 'jpeg', quality: 0.85 });
```

---

## Writing a Custom Component

Custom components must implement a `render()` async method:

```js
class MyBadgeComponent {
  constructor(props) {
    this.props = props;
    this.data = props.data || {};
  }

  async render(ctx, bounds, styles, tokens) {
    const { x, y, width, height } = bounds;

    // Draw badge background
    ctx.fillStyle = tokens['colors.accent.primary'] || '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();

    // Draw badge text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(this.props.label || 'BADGE', x + width / 2, y + height / 2 + 4);
  }
}

// Register with the engine:
engine.registerComponent('my-badge', MyBadgeComponent);

// Use in a card:
card.addComponent('my-badge', { label: 'VIP', x: 10, y: 10, width: 60, height: 24 });
```

### `render(ctx, bounds, styles, tokens)` parameters

| Parameter | Type | Description |
|:----------|:-----|:-----------|
| `ctx` | `CanvasRenderingContext2D` | Active 2D drawing context |
| `bounds` | `{ x, y, width, height }` | Resolved absolute pixel bounds |
| `styles` | `Object` | Computed style object from `StyleEngine` |
| `tokens` | `Object` | Flat token map from `TokenEngine` |

---

## Using Hooks for Canvas Access

If you need canvas access without writing a full component, use the `afterRender` hook:

```js
engine.onHook('afterRender', async ({ renderContext }) => {
  const { ctx } = renderContext;

  // Draw a watermark:
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Inter';
  ctx.textAlign = 'right';
  ctx.fillText('© MyBot', renderContext.canvas.width - 8, renderContext.canvas.height - 6);
  ctx.globalAlpha = 1.0;
});
```

---

## `LRUCache`

Accessed via `engine.cache`. Underlying cache implementation.

### `engine.cache.size` → `number`
Current number of cached items.

### `engine.cache.maxSize` → `number`
Maximum cache capacity.

### `engine.getCacheStats()` → `{ size, maxSize }`
Convenience method on `Engine` that reads these properties.

### `engine.clearCache()` → `void`
Clears all cached assets. Also calls `engine.assetLoader.clearErrors()`.

---

[← Back: Theme Engine API](./theme-engine.md)
