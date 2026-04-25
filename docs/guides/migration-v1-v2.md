# Migration Guide: v1 → v2

This guide covers every breaking change in `@reformlabs/modular` v2.0.0 and shows exactly how to update your code.

---

## Overview of Breaking Changes

| Area | v1 Behavior | v2 Behavior |
|:-----|:-----------|:-----------|
| Import style | `const modular = require(...)` (default) | Named exports — `import { RankCard, createEngine } from ...` |
| Internal paths | `src/modules/` | `src/core/internal/cards/<type>/` |
| Card creation | `modular.rankCard()` | `new RankCard()` or `engine.createRankCard()` |
| Theme API | `modular.setTheme('name')` (global) | Per-card `.setTheme('name')` or `engine.setTheme('name')` |

---

## 1. Package Import

### Before (v1)
```js
const modular = require('@reformlabs/modular');
const card = modular.rankCard();
```

### After (v2)
```js
import { RankCard, createEngine } from '@reformlabs/modular';
// or with CommonJS:
const { RankCard, createEngine } = require('@reformlabs/modular');
```

---

## 2. Creating Cards

### Before (v1)
```js
const card = modular.rankCard()
  .setUser(user)
  .setStats(stats);
```

### After (v2) — Standalone (recommended for simple bots)
```js
import { RankCard } from '@reformlabs/modular';

const buffer = await new RankCard()
  .setUser(user)
  .setStats({ level: 12, xp: 3400, maxXp: 5000, rank: 7 })
  .setTheme('neon-tech')
  .render();
```

### After (v2) — Engine-based (recommended for production)
```js
import { createEngine } from '@reformlabs/modular';

const engine = createEngine({ dpi: 2 });
const buffer = await engine.createRankCard()
  .setUser(user)
  .setStats({ level: 12, xp: 3400, maxXp: 5000, rank: 7 })
  .setTheme('neon-tech')
  .render();
```

---

## 3. Internal Import Paths

If you previously imported internal helpers directly, update your paths:

### Before (v1)
```js
const { computeXP } = require('@reformlabs/modular/src/modules/rank');
```

### After (v2)
```js
// Internal paths (not part of the public API — use at your own risk):
const { computeProgress } = require('@reformlabs/modular/dist/core/internal/cards/rank/service');
```

> **Recommendation:** Use only the public API exported from `@reformlabs/modular`. Internal paths can change between minor versions.

---

## 4. Theme System

### Before (v1)
```js
modular.setTheme('cyberpunk'); // set globally
const card = modular.rankCard(); // inherits global theme
```

### After (v2)
```js
// Per-card theme (preferred):
const buffer = await new RankCard()
  .setTheme('cyberpunk')
  .render();

// Engine-level default theme:
const engine = createEngine();
engine.setTheme('cyberpunk'); // all cards from this engine use cyberpunk by default

// Custom theme:
engine.registerTheme('my-theme', {
  colors: { accent: { primary: '#ff6b6b' } }
}, 'default'); // extends 'default'
```

---

## 5. Card Type Changes

### New Cards in v2
| Card | Builder Class | Factory Method |
|:-----|:-------------|:--------------|
| WelcomeCard | `WelcomeCard` | `engine.createWelcomeCard()` |
| InviteCard | `InviteCard` | `engine.createInviteCard()` |

### Removed in v2
- `modular.leaderboardCard()` (v1 signature) → replace with `engine.createLeaderboardCard()` or `new Leaderboard()`.

---

## 6. Discord.js Integration

### Before (v1)
```js
const buffer = await card.render();
const attachment = new AttachmentBuilder(buffer, { name: 'rank.png' });
await interaction.reply({ files: [attachment] });
```

### After (v2) — Shorthand methods
```js
// Automatically creates attachment and handles replied/deferred state:
await new RankCard()
  .setUser(user)
  .setStats(stats)
  .reply(interaction);

// Or send to a channel:
await new RankCard()
  .setUser(user)
  .setStats(stats)
  .send(channel, { filename: 'rank.png' });
```

---

## 7. Validation Errors

In v2, validation failures throw a `ValidationError` (subclass of `Error`) with structured metadata:

```js
import { RankCard } from '@reformlabs/modular';

try {
  new RankCard().setSize(9999, 400); // width > 4096 — throws
} catch (err) {
  if (err.name === 'ValidationError') {
    console.log(err.field);  // 'width'
    console.log(err.value);  // 9999
  }
}
```

---

## 8. Checklist

- [ ] Replace `require('@reformlabs/modular')` default with named imports.
- [ ] Replace `modular.rankCard()` with `new RankCard()` or `engine.createRankCard()`.
- [ ] Move per-bot theme selection to `.setTheme()` per card.
- [ ] Use `.reply(interaction)` / `.send(channel)` instead of manually creating `AttachmentBuilder`.
- [ ] Register `WelcomeCard` and `InviteCard` commands if needed.
- [ ] Remove any direct imports from `src/modules/`.
