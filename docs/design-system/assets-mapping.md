# Design System Mapping

[← Back: Render Engine API](../api/render-engine.md) | [Next: Custom Theme Creation →](../guides/creating-custom-theme.md)

---

This guide explains how visual design assets (like Figma mockups) map to the library's internal systems — from theme tokens to the final rendering pipeline in `@reformlabs/modular`.

## 1. Primary Branding Assets

The core visual identity of the project is defined by the following logic:

### Card Proportions
- **Default Resolution**: 1600×800 pixels (800×400 logical at DPI 2).
- **Aspect Ratio**: 2:1 is the standard for most Discord embeds, maximizing vertical space without getting cropped on mobile.

## 2. Visual Theme Mappings

Themes in the engine are translated directly from design concepts:

| Theme ID | Designer Interpretation |
| :--- | :--- |
| `light` | Utilizes clean, high-contrast tokens with a pure white surface (`#ffffff`) for versatile embedding. |
| `neon-tech` | Demonstrates heavy `effects.glowStrength` mapping, using stark black backgrounds with `#00f0ff` (cyan) accents. |
| `glass-modern` | Utilizes `effects.glassBlur` to create depth, avoiding solid hex colors in favor of `rgba()` surfaces over dynamic backgrounds. |

## 3. How Assets Translate to `ThemeConfig`

When creating a new theme based on a design mockup, follow these mapping rules:

### Step 1: Color Extraction
Sample colors from the mockup to fill the `colors` block:
```javascript
colors: {
  accent: {
    primary: '#7c3aed', // sampled from the main button/progress bar
    glow: 'rgba(124, 58, 237, 0.4)' // calculated 40% alpha from design shadows
  }
}
```

### Step 2: Radius Resolution
Measure the corner roundness in pixel values. These map directly to:
- `radius.card` (Outer border radius)
- `radius.inner` (Inner panels)
- `radius.avatar` (Percentage for avatar clipping — 50 = circle)

### Step 3: Effect Detection
Analyze the visual effects to set engine-specific flags:
- If you see frosted glass over a background → `effects.glassBlur: 10`
- If you see drop shadows that match the accent color → `effects.glowStrength: 40`
- If you see matrix-style horizontal lines → `effects.scanlines: true`
- If you see neon lines around the card edges → `effects.neonBorders: true`
- If the card border has a specific stroke width → `effects.borderWidth: 2`

## 4. Design-to-Code Consistency

The engine's `StyleEngine` ensures that every design choice in Figma matches the rendered output in Node.js. 

By following this mapping process, you guarantee that any change your designer makes to the branding palette can be implemented in the library using `engine.themeManager.register()` with zero visual drift.

See [Custom Theme Creation](../guides/creating-custom-theme.md) for the exact code required to implement a mapped design.
