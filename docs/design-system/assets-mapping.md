# Design System Mapping

[← Back: Render Engine API](../api/render-engine.md) | [Next: Custom Theme Creation →](../guides/creating-custom-theme.md)

---

This guide explains how the design assets in `docs/assets/` map to the library's internal systems
—from theme tokens to the final rendering pipeline.

## 1. Primary Branding Assets

The core visual identity of the project is defined by the following assets:

### `@modular_banner.png`
- **Builder Reference**: Used primarily as the hero image for the repository and as a reference for `ProfileCardBuilder` banners.
- **Layout Rule**: Defines the standard 3:1 aspect ratio used for top header banners across all themes.

### `@modulardocumentation.png`
- **Purpose**: Used as the header for documentation files and the main README.
- **Logic**: Showcases the engine's capability to render complex, multi-layered text and graphics.

### `@modularinstallation.png`
- **Purpose**: Visual header for the installation and quick-start guides.

### `@modularterms.png`
- **Purpose**: Graphic representation for legal, terms of service, and licensing documentation.

## 2. Visual Theme Mappings

| Asset Reference | Theme ID | Designer Interpretation |
| :--- | :--- | :--- |
| `modularlight_transparent.png` | `light` | Utilizes clean, high-contrast tokens with a transparent background for versatile embedding. |
| `@modulardocumentation.png` | `neon-tech` | Demonstrates the `effect.glowStrength` and vibrant accent mappings. |

## 3. How Assets Translate to `ThemeConfig`

When we create a new theme based on a design asset, we follow these mapping rules:

### Step 1: Color Extraction
We sample colors from the PNG design to fill the `colors` block:
```javascript
colors: {
  accent: {
    primary: '#7c3aed', // sampled from button/progress bar
    glow: 'rgba(124, 58, 237, 0.4)' // calculated alpha from design shadows
  }
}
```

### Step 2: Radius Resolution
We measure the corner roundness in pixel values. These values are mapped to:
- `radius.card`
- `radius.avatar`
- `radius.badge`

### Step 3: Effect Detection
We analyze the visual effects to set engine-specific flags:
- If we see frosted glass → `effect.glassmorphism: true`
- If we see neon glows → `effect.glowStrength: 40`
- If we see matrix lines → `effect.scanlines: true`

## 4. Design-to-Code Consistency

The `designer/` directory in this repository contains mapping utilities that ensure every design in Figma/PNG matches the rendered output in Node.js. 

- **Token Mapping**: See `designer/mappings/designer-token-to-theme.mapper.ts`.
- **Layout Definition**: See `designer/components/RankCard.design.ts`.

By following this mapping, we guarantee that any change your designer makes to the branding assets can be implemented in the library with zero visual drift.
