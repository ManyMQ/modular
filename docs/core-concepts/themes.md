# The Theme System

The Modular engine's most powerful feature is its **Theme-Token decoupling**. This architecture separates the *structure* of a card from its *visual style*.

## 1. How it Works

When you call `.setTheme('esport')`, the engine looks up a JSON-like configuration that defines colors, radii, and effect flags. These values are then flattened into a **Token Map**.

### The Flow:
1. **Raw Theme** (Nested Object)
2. **Token Flattening** (e.g., `colors.accent.primary` → `accent.primary`)
3. **Layout Resolver** (Checks tokens like `radius.card`)
4. **Renderer** (Consumes tokens for drawing)

## 2. The Token Specification

Every theme must implement or inherit from these core token categories:

### Colors (`surface.*`, `accent.*`)
- `surface.primary`: The main card background.
- `accent.primary`: The brand color used for progress bars and highlights.
- `accent.glow`: The color used for neon/glow effects.

### Typography (`font.*`)
- `font.family`: Default is `Inter, sans-serif`.
- `font.size.md`: The base font size for descriptive text.

### Effects (`effect.*`)
Unique to this engine, boolean flags enable or disable complex rendering logic:
- `effect.scanlines`: Draws matrix-style horizontal lines.
- `effect.glassmorphism`: Enables backdrop blur and frosted glass overlays.
- `effect.levelCircle`: Renders a circular XP ring instead of a linear bar.

## 3. Visual Comparison

Based on our design assets, here is how the primary themes differ:

| Theme | Aesthetic | Key Tokens | Asset Inspiration |
| :--- | :--- | :--- | :--- |
| `discord` | Native | `surface.primary: #23272a` | Blurple branding |
| `neon-tech` | Futuristic | `effect.levelCircle: true` | Neon accents |
| `glass-modern`| Minimalist | `effect.glassmorphism: true` | Frosted glass look |
| `pink-gradient`| Soft | `accent.gradientStart: #ff75c3` | Vibrant gradients |

## 4. Built-in Theme Benchmarks

Different themes have different rendering costs.

| Theme | Intensity | Rendering Logic |
| :--- | :--- | :--- |
| `discord` | 🟢 Low | Simple fills and rectangles. |
| `neon-tech` | 🟡 Medium | Multiple shadow passes and circular arcs. |
| `glass-modern`| 🔴 High | Requires multi-pass backdrop blurring. |

## 5. Overriding Tokens via API

You don't need a new theme to change a specific color. You can override any token on a single card instance:

```javascript
card.setToken('accent.primary', '#ff0000'); // Change progress bar to red
card.setToken('radius.card', 0);            // Make the card perfectly square
```

---

Next: [The Render Pipeline](./render-pipeline.md)
