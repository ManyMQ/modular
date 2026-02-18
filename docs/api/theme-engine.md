# API Reference: Theme Engine

The Theme Engine is responsible for the lifecycle of styles within the library. It handles registration, validation, and tokenization.

## `ThemeManager`

Accessed via `engine.themeManager`.

### Methods

#### `.register(id, config)`
Adds a new theme to the engine.
- **id**: `string` Unique identifier (e.g., 'sunset-vibe').
- **config**: `ThemeConfig` The theme object.

#### `.get(id)`
Retrieves the raw theme configuration object.

#### `.list()`
Returns an array of all registered theme objects.

#### `.getActive()`
Returns the ID of the default theme currently in use.

## `TokenEngine`

The internal utility that transforms raw theme data into flat tokens.

#### `.resolve(tokens)`
Calculates the final values of tokens, processing any internal references (e.g., `{accent.primary}`).

#### `.flatten(themeObject)`
Static method that converts a nested theme into a dot-notation map.

## The `ThemeConfig` Interface

When defining a theme, use this structure for full compatibility:

```typescript
interface ThemeConfig {
    name: string;
    colors: {
        surface: { primary: string; secondary: string; tertiary?: string; elevated?: string };
        accent: { primary: string; secondary: string; glow?: string };
        text: { primary: string; secondary: string; muted?: string };
    };
    fonts: {
        family: string;
    };
    radius: {
        card: number;
        avatar: number;
    };
    effects?: {
        glowStrength?: number;
        glassmorphism?: boolean;
        scanlines?: boolean;
        [key: string]: any;
    };
}
```

---

Next: [Render Engine API](./render-engine.md)
