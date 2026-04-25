# Creating a Custom Theme

This guide walks you through building a fully custom brand theme for `@reformlabs/modular`, from color selection to registration and testing.

---

## Prerequisites

- `@reformlabs/modular` v2.0+ installed
- Basic understanding of color theory (HSL recommended)
- Familiarity with the [Theme System](../core-concepts/themes.md)

---

## Step 1: Choose Your Color Palette

Design your theme around a **primary accent** color. Use HSL to derive consistent shades:

```
Primary:   hsl(250, 80%, 60%)  →  #7c3aed  (indigo)
Glow:      rgba(124, 58, 237, 0.4)
Secondary: hsl(260, 70%, 65%)  →  #8b5cf6
Surface:   hsl(240, 20%, 8%)   →  #0e0e16  (near-black with blue tint)
```

**Recommended:** Use a tool like [Coolors](https://coolors.co) or [Radix UI Colors](https://www.radix-ui.com/colors) to generate harmonious palettes.

---

## Step 2: Create the Theme File

Create `themes/my-brand.js` in your project:

```js
// themes/my-brand.js
'use strict';

const myBrandTheme = {
  name: 'my-brand',
  description: 'Custom brand theme for Acme Discord bot',

  colors: {
    surface: {
      primary: '#0e0e16',      // Main card background
      secondary: '#15151f',    // Secondary panels
      tertiary: '#1c1c2a',     // Tertiary areas
      elevated: '#08080e'      // Highest elevation (darkest)
    },
    accent: {
      primary: '#7c3aed',         // Main accent — buttons, highlights
      secondary: '#8b5cf6',       // Secondary accent
      glow: 'rgba(124, 58, 237, 0.4)', // Shadow/glow color
      gradientStart: '#7c3aed',   // Progress bar start
      gradientEnd: '#8b5cf6'      // Progress bar end
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1b5',
      muted: '#6b6b80',
      inverse: '#0e0e16'
    },
    border: {
      default: 'rgba(255, 255, 255, 0.08)',
      accent: '#7c3aed',
      subtle: 'rgba(124, 58, 237, 0.25)'
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
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
      '2xl': 26
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32
  },

  radius: {
    card: 16,
    inner: 12,
    pill: 24,
    avatar: 50
  },

  avatar: {
    shape: 'circle' // 'circle' | 'hexagon' | 'square'
  },

  effects: {
    glowStrength: 25,
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
    card: '0 8px 32px rgba(0, 0, 0, 0.4)',
    glow: '0 0 40px rgba(124, 58, 237, 0.4)'
  }
};

module.exports = myBrandTheme;
```

---

## Step 3: Register the Theme

### Option A: Register on your engine instance

```js
import { createEngine } from '@reformlabs/modular';
const myBrandTheme = require('./themes/my-brand');

const engine = createEngine();
engine.registerTheme('my-brand', myBrandTheme);

// Use it:
const buffer = await engine.createRankCard()
  .setUser(user)
  .setStats(stats)
  .setTheme('my-brand')
  .render();
```

### Option B: Extend an existing theme (less code)

If your brand is close to an existing theme, extend it:

```js
engine.extendTheme('default', 'my-brand', {
  colors: {
    accent: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      glow: 'rgba(124, 58, 237, 0.4)',
      gradientStart: '#7c3aed',
      gradientEnd: '#8b5cf6'
    }
  }
});
```

This inherits all other fields from `'default'` and only overrides the accent colors.

---

## Step 4: Test the Theme

```js
// test-theme.js
const { createEngine } = require('@reformlabs/modular');
const myBrandTheme = require('./themes/my-brand');
const fs = require('fs');

async function test() {
  const engine = createEngine({ dpi: 2 });
  engine.registerTheme('my-brand', myBrandTheme);

  const cards = ['rank', 'music', 'profile', 'leaderboard', 'invite', 'welcome'];

  for (const type of cards) {
    const card = engine.createCard(type)
      .setUsername('TestUser')
      .setAvatar('https://github.com/manymq.png')
      .setTheme('my-brand');

    if (type === 'rank') card.setStats({ level: 10, xp: 3000, maxXp: 5000, rank: 5 });

    const buffer = await card.render();
    fs.writeFileSync(`./test-output/${type}-my-brand.png`, buffer);
    console.log(`✅ ${type} card rendered`);
  }
}

test().catch(console.error);
```

Run:
```bash
node test-theme.js
```

Inspect the output PNGs in `./test-output/`.

---

## Step 5: Fine-Tune

### Adjust glow intensity

```js
effects: {
  glowStrength: 40,  // 0 = no glow, 60 = very intense
}
```

### Enable neon borders (cyberpunk look)

```js
effects: {
  neonBorders: true,
  borderWidth: 2,
}
```

### Enable level circle badge on avatar

```js
effects: {
  levelCircle: true,
}
```

### Adjust progress bar height

```js
effects: {
  progressHeight: 12, // pixels (default: 10)
}
```

### Change avatar clip shape

```js
avatar: {
  shape: 'hexagon'  // 'circle' | 'hexagon' | 'square'
}
```

---

## Step 6: Ship It

Once tested, export your theme from a shared module so all bot files use it:

```js
// lib/engine.js
import { createEngine } from '@reformlabs/modular';
const myBrandTheme = require('../themes/my-brand');

const engine = createEngine({ dpi: 2, cache: { maxSize: 256 } });
engine.registerTheme('my-brand', myBrandTheme);
engine.setTheme('my-brand'); // set as global default

module.exports = { engine };
```

```js
// commands/rank.js
const { engine } = require('../lib/engine');

export async function handleRankCommand(interaction) {
  await engine.createRankCard()
    .setUser(interaction.user)
    .setStats(await db.getStats(interaction.user.id))
    .reply(interaction);
}
```

---

## Best Practices

| Practice | Reason |
|:---------|:-------|
| Use `extendTheme()` over writing themes from scratch | Fewer fields to maintain; inherits engine defaults correctly |
| Keep `glow` colors consistent with `accent.primary` | Visual coherence — glow should be a semi-transparent version of accent |
| Test at DPI 1 and DPI 2 | Effects scale differently |
| Use `rgba()` for glow and border.subtle | Transparent overlays blend correctly over any surface color |
| Avoid pure `#000000` or `#ffffff` surfaces | Slight tints feel more premium |

---

## Theme Validation Script

Run the built-in theme validator to catch missing or malformed fields:

```bash
npm run validate
```

This executes `scripts/validate-themes.js` and reports any issues in your registered themes.
