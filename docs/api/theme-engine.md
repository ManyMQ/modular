# Theme Engine API Reference

![Documentation](../assets/@modulardocumentation.png)

[← Back: CardBuilder API](./card-builder.md) | [Next: Render Engine API →](./render-engine.md)

---

The Theme Engine is composed of two cooperating subsystems:

- **`ThemeManager`** — registers, stores, extends, and activates themes
- **`TokenEngine`** — resolves design token references and flattens themes into flat maps

Both are instantiated automatically inside `Engine` and are accessible via `engine.themeManager` and `engine.tokenEngine`.

---

## `ThemeManager`

### `.register(name, definition, base?)` → `ThemeManager`

Registers a theme. If `base` is provided, the definition is deep-merged on top of the base theme.

```js
// Standalone:
engine.themeManager.register('my-brand', myBrandTheme);

// Extending an existing theme:
engine.themeManager.register('neon-red', { colors: { accent: { primary: '#ff0040' } } }, 'neon-tech');
```

Throws `Error` if `name` or `definition` is falsy.

---

### `.get(name)` → `Object`

Returns the theme definition. **Falls back to `'default'` silently** if not found — never returns `undefined`.

```js
const theme = engine.themeManager.get('neon-tech');
console.log(theme.colors.accent.primary); // '#00f0ff'
```

---

### `.setActive(name)` → `ThemeManager`

Sets the engine-wide default theme for all cards that don't call `.setTheme()`.

```js
engine.themeManager.setActive('glass-modern');
// equivalent shorthand:
engine.setTheme('glass-modern');
```

Throws `Error` if the theme name is not registered.

---

### `.getActive()` → `Object`

Returns the full definition object of the currently active theme.

```js
const active = engine.themeManager.getActive();
console.log(active.name); // e.g. 'glass-modern'
```

---

### `.extend(baseName, newName, overrides)` → `Object`

Deep-merges `overrides` on top of `baseName`, registers under `newName`, and returns the merged theme.

```js
engine.themeManager.extend('neon-tech', 'neon-red', {
  colors: {
    accent: {
      primary: '#ff0040',
      secondary: '#ff4080',
      glow: 'rgba(255,0,64,0.5)'
    }
  }
});
```

Throws `Error` if `baseName` is not registered.

---

### `.getToken(name, path, fallback?)` → `any` *(v2.1)*

Retrieves a single value from a theme via dot-path without flattening the full theme.

```js
const color = engine.themeManager.getToken('neon-tech', 'colors.accent.primary', '#fff');
// '#00f0ff'

const glow = engine.themeManager.getToken('neon-tech', 'effects.glowStrength', 20);
// 40
```

---

### `.list()` → `string[]`

Returns an array of all registered theme IDs.

```js
engine.themeManager.list();
// ['default', 'cyberpunk', 'neon-tech', 'glass-modern', 'esport', ...]
```

---

## `ThemeConfig` Interface

```ts
interface ThemeConfig {
  name: string;
  description?: string;
  colors: {
    surface: { primary: string; secondary: string; tertiary?: string; elevated?: string };
    accent: { primary: string; secondary: string; glow?: string; gradientStart?: string; gradientEnd?: string };
    text: { primary: string; secondary: string; muted?: string; inverse?: string };
    border?: { default?: string; accent?: string; subtle?: string };
    status?: { online?: string; idle?: string; dnd?: string; offline?: string; streaming?: string };
  };
  fonts?: { family?: string; sizes?: Record<string, number>; weights?: Record<string, number> };
  spacing?: Record<string, number>;
  radius?: { card?: number; inner?: number; pill?: number; avatar?: number };
  avatar?: { shape?: 'circle' | 'hexagon' | 'square' };
  effects?: {
    glowStrength?: number; shadowBlur?: number; shadowOffset?: number;
    glassBlur?: number; borderWidth?: number; progressHeight?: number;
    neonBorders?: boolean; scanlines?: boolean; particles?: boolean; levelCircle?: boolean;
  };
  shadows?: { card?: string; glow?: string };
}
```

All fields except `name` and `colors` are optional — missing fields fall back to the `'default'` theme at render time.

---

## `TokenEngine`

### `engine.tokenEngine.define(name, value)`

Defines a single global token.

```js
engine.tokenEngine.define('accent.primary', '#7c3aed');
```

### `engine.tokenEngine.defineBatch(tokens)`

Defines multiple tokens at once.

```js
engine.tokenEngine.defineBatch({
  'accent.primary': '#7c3aed',
  'accent.glow': 'rgba(124,58,237,0.4)'
});
```

### `engine.tokenEngine.resolve(tokens)` → `Object`

Resolves a flat token map, expanding any `{token.path}` references.

```js
engine.tokenEngine.resolve({
  'accent.primary': '#7c3aed',
  'my.color': '{accent.primary}' // resolves to '#7c3aed'
});
```

---

## Utility Exports

### `themeToTokens(theme)` → `Object`

Converts a theme name or definition to a flat dot-path token map.

```js
import { themeToTokens } from '@reformlabs/modular';

const tokens = themeToTokens('neon-tech');
// { 'colors.surface.primary': '#050505', 'colors.accent.primary': '#00f0ff', ... }

const tokens2 = themeToTokens(myCustomThemeObject);
```

### `getAvailableThemes()` → `Array<{ id, name, description }>`

Returns metadata for all 21 registered themes.

```js
import { getAvailableThemes } from '@reformlabs/modular';

getAvailableThemes().forEach(({ id, name, description }) => {
  console.log(`${id}: ${name}`);
});
```

---

## Practical Patterns

### Override one token per card while keeping a global theme

```js
engine.setTheme('neon-tech');

const buffer = await engine.createRankCard()
  .setUser(user)
  .setStats(stats)
  .setToken('colors.accent.primary', '#ff6b6b')
  .render();
```

### Build a shared engine module with registered brand themes

```js
// lib/engine.js
const { createEngine } = require('@reformlabs/modular');
const brandTheme = require('./themes/brand');

const engine = createEngine({ dpi: 2 });
engine.themeManager.register('brand', brandTheme);
engine.themeManager.register('brand-dark', { colors: { surface: { primary: '#050505' } } }, 'brand');
module.exports = { engine };
```

---

[← Back: CardBuilder API](./card-builder.md) | [Next: Render Engine API →](./render-engine.md)
