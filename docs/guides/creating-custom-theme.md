# Guide: Creating Custom Themes

Building a theme allow you to completely white-label the engine for your brand. This guide covers how to define, register, and use your own themes.

## 1. Defining the Structure

A theme is a nested JavaScript object. While you can omit keys to use defaults, we recommend defining at least the `colors` and `radius` blocks.

### The Full Schema:

```javascript
const MyLuxuryTheme = {
    name: 'Luxury Velvet',
    colors: {
        surface: {
            primary: '#1a051d',     // Main background
            secondary: '#2a0a2d',   // Panel colors
            elevated: '#0d0d0f'    // Darker areas
        },
        accent: {
            primary: '#d4af37',     // Gold
            secondary: '#b8860b',   // Darker gold
            glow: 'rgba(212, 175, 55, 0.3)'
        },
        text: {
            primary: '#ffffff',
            secondary: '#dec8e3'
        }
    },
    radius: {
        card: 25,
        avatar: 999 // Makes avatar perfect circle
    },
    effects: {
        glowStrength: 30,
        softShadows: true,
        glassmorphism: false
    }
};
```

## 2. Registering the Theme

Register your theme with the `ThemeManager` during your bot startup.

```javascript
const { createEngine } = require('@modular/card-engine');
const engine = createEngine();

// Register once
engine.registerTheme('luxury', MyLuxuryTheme);
```

## 3. Best Practices for Designers

When designing a new theme in software like Figma, keep these "Renderer Constraints" in mind:

- **Rounded Corners**: Avoid varying radii for individual corners of the same element (e.g., top-left: 10, bottom-right: 20). The engine optimized for uniform radii per element.
- **Opacity**: Use `rgba()` strings for colors if you want transparency. 
- **Gradients**: The engine supports linear gradients for backgrounds and progress bars. Map these to the `accent.gradientStart` and `accent.gradientEnd` tokens.

## 4. Visual Comparison of Effects

![Theme Effects Comparison](../assets/@modulardocumentation.png)

- **`glowStrength`**: Increasing this value expands the drop-shadow/outer-glow of accent elements. Values above 50 can impact rendering performance.
- **`glassmorphism`**: This effect is compute-heavy. It uses a 2-pass Gaussian blur on the background layer before drawing the frosted-glass overlay.

## 5. Performance Optimization

If your theme uses multiple gradients and high glow strength:
- **Enable Caching**: Ensure you are reusing the same `Engine` instance.
- **Reduce DPI**: If rendering many cards per second, use `dpi: 1.5` instead of `2`.

---

Next: [Performance & Optimization](./performance.md)
