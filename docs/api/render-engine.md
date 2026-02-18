# API Reference: Render Engine

The Render Engine provides low-level control over the canvas. While most users should use the `CardBuilder`, the Render Engine is useful for building custom components or plugins.

## `CanvasRenderer`

The core class that interfaces with `@napi-rs/canvas`.

### Methods

#### `.createContext(width, height, dpi)`
Initializes a new `RenderContext` with a fresh canvas.
- Returns: `RenderContext`

#### `.applyEffect(ctx, effectConfig)`
Executes post-processing logic on the canvas.
- **effectConfig**: `{ type: string; [key: string]: any }`

## `RenderContext`

Represents a single rendering surface.

### Properties

#### `canvas`
The `@napi-rs/canvas` instance.

#### `ctx`
The 2D rendering context (compatible with standard Web Canvas API).

### Methods

#### `release()`
Closes the canvas and returns it to the engine's pool. **Crucial for performance.**

## `AssetLoader`

Handles retrieval and caching of remote images.

#### `.load(url)`
Returns a `Promise<Image>` containing the loaded pixel data. 

#### `.clearCache()`
Wipes the internal image cache. Use this if you are rendering many unique user avatars and want to save RAM.

---

Next: [Examples Overview](../examples/examples-overview.md)
