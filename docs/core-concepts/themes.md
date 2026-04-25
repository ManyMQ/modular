# Theme System

Themes are the core of `@reformlabs/modular`'s design system. A single theme ID controls colors, typography, spacing, radius, effects, and shadows across your entire card — no per-element overrides required.

---

## Available Themes

| ID | Name | Style |
|:---|:-----|:------|
| `default` | Default | Dark purple/indigo baseline |
| `cyberpunk` | Cyberpunk | Neon yellow + dark |
| `neon-tech` | Neon Tech | Cyan/magenta glow, scanlines |
| `glass-modern` | Glass Modern | Frosted glass, soft blur |
| `minimal-developer` | Minimal Developer | Clean monochrome, sharp typography |
| `pink-gradient` | Pink Gradient | Warm pinks and purples |
| `esport` | Esport | High-contrast sport palette *(v2.1)* |
| `discord` | Discord | Discord brand colors |
| `dark` | Dark | Pure dark mode |
| `light` | Light | Light mode |
| *(+ 11 legacy themes)* | — | See `getAvailableThemes()` |

> **Total: 21 themes** registered at engine boot.

---

## Using a Theme

### Per-card (recommended)

```js
import { RankCard } from '@reformlabs/modular';

const buffer = await new RankCard()
  .setUser(user)
  .setStats({ level: 10, xp: 4200, maxXp: 5000, rank: 3 })
  .setTheme('neon-tech')
  .render();
```

### Engine-level default

```js
import { createEngine } from '@reformlabs/modular';

const engine = createEngine();
engine.setTheme('glass-modern'); // all cards from this engine inherit this theme
```

### Listing available themes

```js
import { getAvailableThemes } from '@reformlabs/modular';

getAvailableThemes().forEach(({ id, name, description }) => {
  console.log(`${id}: ${name} — ${description}`);
});
```

---

## Theme Structure

Every theme is a plain JavaScript object with the following shape:

```js
const myTheme = {
  name: 'my-theme',
  description: 'Optional description',

  colors: {
    surface: {
      primary: '#0a0a0f',      // card background
      secondary: '#16161e',    // secondary panels
      tertiary: '#1a1a23',     // tertiary surfaces
      elevated: '#050508'      // elevated elements
    },
    accent: {
      primary: '#7c3aed',       // primary accent color
      secondary: '#8b5cf6',     // secondary accent color
      glow: 'rgba(139,92,246,0.4)', // glow shadow color
      gradientStart: '#7c3aed', // progress bar gradient start
      gradientEnd: '#8b5cf6'    // progress bar gradient end
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      muted: '#6b7280',
      inverse: '#050505'
    },
    border: {
      default: 'rgba(255,255,255,0.1)',
      accent: '#7c3aed',
      subtle: 'rgba(139,92,246,0.3)'
    },
    status: {
      online: '#22c55e',
      idle: '#f59e0b',
      dnd: '#ef4444',
      offline: '#6b7280',
      streaming: '#a855f7'
    }
  },

  fonts: {
    family: '"Inter", "Poppins", sans-serif',
    sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 26 },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },

  radius: {
    card: 16,    // outer card corner radius
    inner: 12,   // inner element radius
    pill: 24,    // pill-shape radius
    avatar: 50   // avatar clip radius (% for circle)
  },

  avatar: {
    shape: 'circle' // 'circle' | 'hexagon' | 'square'
  },

  effects: {
    glowStrength: 20,
    shadowBlur: 20,
    shadowOffset: 0,
    glassBlur: 0,
    borderWidth: 1,
    progressHeight: 10,
    neonBorders: false,
    scanlines: false,
    particles: false,
    levelCircle: false
  },

  shadows: {
    card: '0 8px 32px rgba(0,0,0,0.4)',
    glow: '0 0 40px rgba(139,92,246,0.4)'
  }
};
```

All fields are optional — missing fields fall back to the `default` theme values.

---

## Creating a Custom Theme

### Method 1: Register standalone

```js
import { createEngine } from '@reformlabs/modular';

const engine = createEngine();

engine.registerTheme('my-brand', {
  name: 'my-brand',
  colors: {
    surface: { primary: '#0f0a1e', secondary: '#1a1033' },
    accent: {
      primary: '#e11d48',
      glow: 'rgba(225, 29, 72, 0.4)',
      gradientStart: '#e11d48',
      gradientEnd: '#fb7185'
    }
  }
});

const buffer = await engine.createRankCard()
  .setUser(user)
  .setStats(stats)
  .setTheme('my-brand')
  .render();
```

### Method 2: Extend an existing theme

```js
// Inherit everything from 'neon-tech', override just the accent colors:
engine.extendTheme('neon-tech', 'neon-red', {
  colors: {
    accent: {
      primary: '#ff0040',
      secondary: '#ff4080',
      glow: 'rgba(255, 0, 64, 0.5)',
      gradientStart: '#ff0040',
      gradientEnd: '#ff4080'
    }
  }
});

const buffer = await engine.createRankCard()
  .setTheme('neon-red')
  .render();
```

### Method 3: `createTheme()` helper

```js
import { createTheme } from '@reformlabs/modular';

export const brandTheme = createTheme({
  name: 'brand',
  colors: {
    accent: { primary: '#10b981' }
  }
});

// Then register it:
engine.registerTheme('brand', brandTheme);
```

---

## Token System

When a theme is applied to a card, it is flattened into a **token map** — a flat object of dot-path keys to values:

```js
import { themeToTokens } from '@reformlabs/modular';

const tokens = themeToTokens('neon-tech');
// {
//   'colors.surface.primary': '#050505',
//   'colors.accent.primary': '#00f0ff',
//   'colors.text.primary': '#ffffff',
//   ...
// }
```

You can also override individual tokens on a per-card basis:

```js
const buffer = await new RankCard()
  .setTheme('neon-tech')
  .setToken('colors.accent.primary', '#ff6b6b') // red instead of cyan
  .render();
```

Or set multiple tokens at once:

```js
card.setTokens({
  'colors.accent.primary': '#ff6b6b',
  'colors.accent.glow': 'rgba(255, 107, 107, 0.4)'
});
```

---

## Theme Manager API

### `themeManager.register(name, definition, base?)`
### `themeManager.setActive(name)`
### `themeManager.get(name)` → returns theme object (falls back to `'default'`)
### `themeManager.getActive()` → returns currently active theme object
### `themeManager.extend(baseName, newName, overrides)` → returns merged theme
### `themeManager.getToken(name, 'colors.accent.primary', fallback)` *(v2.1)*

```js
const accentColor = engine.themeManager.getToken('neon-tech', 'colors.accent.primary', '#ffffff');
// '#00f0ff'
```

---

## Effect Flags

The `effects` block in a theme enables/disables optional visual layers:

| Flag | Type | Description |
|:-----|:-----|:-----------|
| `neonBorders` | bool | Glowing neon border lines |
| `scanlines` | bool | CRT scanline overlay |
| `particles` | bool | Floating particle animation |
| `levelCircle` | bool | Circular level badge on avatar |
| `glowStrength` | number | Intensity of the glow blur |
| `progressHeight` | number | Height of progress bar in px |
| `glassBlur` | number | Glass panel blur intensity |
| `borderWidth` | number | Card border stroke width in px |

---

## Best Practices

1. **Always extend rather than duplicate** — use `extendTheme()` to build brand themes on top of the closest existing theme.
2. **Keep accent colors in sync** — `primary`, `glow`, `gradientStart`, and `gradientEnd` should all be hue-consistent.
3. **Test at DPI 1 and DPI 2** — glow and blur effects look very different at different scales.
4. **Avoid pure white/black surfaces** — slight tints (`#0a0a0f` instead of `#000000`) look more premium.
