# The Render Pipeline: Engineering Deep Dive

The Modular engine uses a 9-stage pipeline to transform your data into a pixel-perfect image. Understanding this pipeline is key for advanced developers and those wanting to write custom plugins.

![Architecture Diagram](../assets/modulardark_banner_transparent.png)

## 1. Architectural Philosophy

We follow a **Data-Driven Model**.
- **Themes** don't render. They only provide data (tokens).
- **Builders** don't style. They only organize data (properties).
- **Layouts** are independent. They describe position, not pixels.

## 2. The 9 Pipeline Phases

### Phase 1: Layout Resolve
The engine takes the component tree and calculates absolute positions. If you provide a `rank-card` preset, the engine resolves exactly where the avatar, text, and bars go based on the current canvas width.

### Phase 2: Token Resolve
Merging global theme tokens with layout-specific overrides. This is where variable substitution happens (e.g., resolving `{accent.primary}`).

### Phase 3: Style Resolve
Mapping the raw tokens to visual styles that the renderer understands (colors, font weights, shadows).

### Phase 4: Asset Preload
Loading external images (avatars, banners) and custom fonts. This is done in parallel to minimize latency.

### Phase 5: Pre-Render Hooks
Executing any registered plugins that need to modify the state before drawing begins.

### Phase 6: Component Render Pass
The actual drawing happens here. Each component (`Avatar`, `Text`, `Progress`) executes its `render()` logic onto the internal canvas.

### Phase 7: FX Pass (Global Effects)
Applying global post-processing like scanlines, grid overlays, or full-canvas gradients.

### Phase 8: Post-Render Hooks
Final plugin execution for watermarks or meta-data injection.

### Phase 9: Export Encode
Compressing the raw canvas pixels into the requested format (PNG/JPEG/WebP) and returning the buffer.

## 3. Why this isolation matters

Because the **Layout Engine** is independent, you can change the card width from 400px to 1000px, and the elements will automatically re-position and scale without the component logic needing to handle it.

## 4. Performance Considerations

- **Pipeline Parallelism**: Asset loading happens while layout is being resolved.
- **Lazy Rendering**: We don't render hidden elements or zero-opacity tokens.
- **Smart Caching**: The resolved layout and style maps are cached if the input data hasn't changed.

---

Next: [Card Builders](./builders.md)
