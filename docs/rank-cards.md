# Rank Cards

<div align="center">

**Display user levels, XP, and rank information**

[![Rank Cards](https://img.shields.io/npm/dw/modular?style=flat-square&logo=trophy)](rank-cards.md)

</div>

Rank cards display user level, XP, and rank information with progress visualization.

<div align="center">

![Rank Card Preview](assets/@modularlight_transparent.png)

*Beautiful rank cards*

</div>

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [XP Configuration](#xp-configuration)
- [Progress Visualization](#progress-visualization)
- [Examples](#examples)
- [Styling Options](#styling-options)

---

## Overview

Rank cards provide a visual representation of a user's progress, including:

- User avatar and username
- Current level
- XP progress bar
- Current rank
- Total XP accumulated
- Badges and achievements

---

## Basic Usage

### Creating a Rank Card

```javascript
const { createEngine } = require('modular');

const engine = createEngine();

const rankCard = engine.createRankCard()
  .setUser(user)
  .setStats({
    level: 50,
    xp: 7500,
    maxXp: 10000,
    rank: 5,
    totalXp: 150000
  });

await rankCard.send(interaction);
```

### With Guild Context

```javascript
const rankCard = engine.createRankCard()
  .setUser(interaction.user)
  .setGuild(interaction.guild)
  .setTheme('cyberpunk')
  .setStats({
    level: 42,
    xp: 8500,
    maxXp: 10000,
    rank: 10
  });

await rankCard.send(interaction);
```

---

## XP Configuration

### Basic XP Info

```typescript
interface RankStats {
  level: number;      // Current level
  xp: number;         // Current XP
  maxXp: number;      // XP needed for next level
  rank?: number;      // Server rank (optional)
  totalXp?: number;   // Total XP (optional)
}
```

### Extended XP Info

```typescript
interface ExtendedRankStats {
  level: number;
  xp: number;
  maxXp: number;
  rank?: number;
  totalXp?: number;
  previousXp?: number;  // XP at last level up
  xpToNextLevel?: number; // Calculated automatically
}
```

### XP Calculation

```javascript
// Calculate XP needed for next level
const xpToNextLevel = stats.maxXp - stats.xp;

// Calculate progress percentage
const progress = stats.xp / stats.maxXp;

// Set XP with calculations
card.setStats({
  level: 50,
  xp: 7500,
  maxXp: 10000,
  rank: 5,
  totalXp: 150000,
  xpToNextLevel: 2500
});
```

---

## Progress Visualization

### Set Progress (0-1)

```javascript
// Calculate progress ratio
const progress = stats.xp / stats.maxXp;

rankCard.setProgress(progress);
```

### Manual Progress

```javascript
rankCard.setProgress(0.75); // 75% complete
```

### Progress Color

```javascript
// Custom progress bar color
rankCard.setProgressColor('#ff00ff');

// Using theme tokens
rankCard.setTokens({
  'progress.fill': '#ff00ff',
  'progress.background': 'rgba(255, 255, 255, 0.1)'
});
```

### Progress Bar Options

```javascript
rankCard.setTokens({
  'progress.height': 12,
  'progress.borderRadius': 6,
  'progress.fill': '#00ffcc',
  'progress.background': 'rgba(255, 255, 255, 0.2)'
});
```

---

## Examples

### Basic Rank Card

```javascript
const rankCard = engine.createRankCard()
  .setUser(interaction.user)
  .setStats({
    level: 25,
    xp: 7500,
    maxXp: 10000,
    rank: 42
  })
  .setTheme('dark');

await rankCard.send(interaction);
```

### Full Featured Rank Card

```javascript
const rankCard = engine.createRankCard()
  .setUser(interaction.user)
  .setStats({
    level: 75,
    xp: 8500,
    maxXp: 10000,
    rank: 5,
    totalXp: 250000
  })
  .setTheme('cyberpunk')
  .setProgressColor('#00ffcc')
  .setRankPosition('left')
  .setBackground({
    type: 'gradient',
    colors: ['#1a1a2e', '#16213e'],
    direction: 'horizontal'
  })
  .setTokens({
    'text.fontFamily': 'Montserrat',
    'text.level.size': 48,
    'text.xp.size': 14,
    'progress.height': 12
  });

await rankCard.send(interaction);
```

### Rank Card with Badges

```javascript
const rankCard = engine.createRankCard()
  .setUser(interaction.user)
  .setStats({
    level: 50,
    xp: 7500,
    maxXp: 10000,
    rank: 10
  })
  .setTheme('neon')
  .setBadges([
    { type: 'online', position: 'top-right' },
    { type: 'verified', position: 'top-left' },
    { type: 'boost', position: 'bottom-right' }
  ]);

await rankCard.send(interaction);
```

### Level Up Card

```javascript
async function createLevelUpCard(user, newLevel) {
  return engine.createRankCard()
    .setUser(user)
    .setStats({
      level: newLevel,
      xp: 0,
      maxXp: calculateMaxXp(newLevel),
      rank: await getUserRank(user.id)
    })
    .setTheme('celebration')
    .setBackground({
      type: 'gradient',
      colors: ['#ffd700', '#ff8c00'],
      direction: 'horizontal'
    })
    .setTokens({
      'text.primary': '#ffffff',
      'progress.fill': '#ffd700'
    });
}

// Usage
const levelUpCard = await createLevelUpCard(user, 50);
await levelUpCard.send(interaction);
```

---

## Styling Options

### Progress Bar Styles

```javascript
card.setTokens({
  'progress.height': 10,
  'progress.borderRadius': 5,
  'progress.fill': '#00ffcc',
  'progress.background': 'rgba(255, 255, 255, 0.15)',
  'progress.glow': true
});
```

### Avatar Styles

```javascript
card.setTokens({
  'avatar.size': 100,
  'avatar.border': '#00ffcc',
  'avatar.borderWidth': 4,
  'avatar.shape': 'circle'
});
```

### Text Styles

```javascript
card.setTokens({
  'text.fontFamily': 'Montserrat',
  'text.level.size': 32,
  'text.level.weight': 700,
  'text.xp.size': 14,
  'text.xp.weight': 400,
  'text.rank.size': 16,
  'text.primary': '#ffffff',
  'text.secondary': '#b3b3b3'
});
```

### Card Layout

```javascript
card.setTokens({
  'card.width': 600,
  'card.height': 200,
  'card.background': '#1a1a2e',
  'card.borderRadius': 16,
  'card.padding': 20
});
```

---

## Related Documentation

- [API Reference - Rank Card](api-reference.md#rank-card-specific-methods)
- [Theme System](themes.md)
- [Token System](api-reference.md#token-system)
- [Output Guide](output-guide.md)

<div align="center">

![Terms](assets/@modularterms.png)

*Track your progress*

</div>
