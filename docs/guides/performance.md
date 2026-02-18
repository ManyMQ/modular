# Performance & Optimization

The Modular engine is built for speed, typically rendering cards in under 100ms. However, certain configurations can significantly impact memory and CPU usage. This guide helps you optimize your application for high-scale production environments.

## 1. Engine Initialization

**CRITICAL: Singleton Pattern**
Never initialize `createEngine()` inside a command handler. Initializing the engine involves loading fonts into memory and pre-compiling theme shaders.

```javascript
// ❌ WRONG
async function onCommand(interaction) {
    const engine = createEngine(); // Expensive!
    await engine.createRankCard().render();
}

// ✅ CORRECT
const engine = createEngine();
async function onCommand(interaction) {
    await engine.createRankCard().render();
}
```

## 2. Memory Management

Our engine uses an internal **Canvas Pool** to prevent memory leaks and reduce garbage collection pressure.

- **Pool Size**: The default is 5. If you are handling 50+ concurrent render requests, increase this in the engine config: 
  `createEngine({ renderer: { maxPoolSize: 15 } })`.
- **Garbage Collection**: Images (avatars) are cached in the `AssetCache`. Large bot clusters should monitor heap usage and use `engine.assetCache.clear()` periodically if memory becomes an issue.

## 3. The Cost of Visual Effects

Not all visual features are created equal.

| Feature | Cost | Impact |
| :--- | :--- | :--- |
| **Simple Fills** | 🟢 Low | Negligible CPU impact. |
| **Gradients** | 🟡 Medium | Requires linear interpolation passes. |
| **Outer Glows** | 🟠 High | Uses Gaussian blur calculations. |
| **Glassmorphism**| 🔴 Extreme | Multi-pass backdrop blurring. Avoid on high-volume bot commands. |

## 4. Canvas Scaling (DPI)

The `DPI` (Dots Per Inch) determines the actual pixel count of the canvas relative to its coordinate size.

- **DPI 1**: Fastest. Good for mobile preview or low-bandwidth environments.
- **DPI 2**: Standard. The "Sweet Spot" for Sharpness vs. Speed.
- **DPI 3+**: Retina quality. Best for one-off profile pictures, not recommended for real-time chat commands.

## 5. Caching Strategy

The `RenderPipeline` includes a `stepAssetPreload` phase. To maximize speed:
- Provide direct URLs for avatars so the engine can fetch them in parallel.
- Use a dedicated CDN if you are serving static theme backgrounds.

## 6. Worker Threads

If your bot handles extreme traffic (1,000+ cards/min), we recommend running the Card Engine inside a Node.js `worker_thread`. This prevents the rendering compute from blocking the main event loop (which handles Discord's heartbeat).

```javascript
const { Worker } = require('worker_threads');
// offload the .render() call to a separate CPU thread
```

## 7. Font Loading System

The engine automatically loads fonts specified in `fonts.family`. To optimize:
- Prefer system fonts like `Arial` or `Helvetica` for zero-load time.
- If using custom fonts (e.g., `Inter`), ensure the `.ttf` or `.woff2` files are local to the server to prevent network-induced rendering delays.
- Fonts are cached globally; the first render will be slower than subsequent ones.