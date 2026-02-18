# Asset Mapping & Design Language

This guide explains how the design assets in `docs/assets/` map to the library's internal systems—from theme tokens to the final rendering pipeline.

## 1. Primary Branding Assets

The core visual identity of the project is defined by the following assets:

### `@modulardark.png` & `@modularlight.png`
- **Theme Mapping**: `discord` theme.
- **Logic**: These assets showcase how the engine renders transparent vs. opaque backgrounds.
- **Token Inspiration**: 
    - `surface.primary`: `#1a1b26` (Dark)
    - `surface.primary`: `#f3f4f6` (Light)

### `@modulardark_banner.png`
- **Builder Reference**: Used primarily by the `ProfileCardBuilder`.
- **Layout Rule**: Defines the standard 3:1 aspect ratio used for top header banners across all themes.

## 2. Visual Theme Mappings

| Asset Reference | Theme ID | Designer Interpretation |
| :--- | :--- | :--- |
| `modulardark_transparent.png` | `glass-modern` | Utilizes the `effect.glassmorphism` token. Uses a 20px blur radius and a 10% white alpha overlay. |
| `modulardark.png` | `discord` | Uses the standard Discord Gray-Dark color palette. |

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
