# Leaderboard Cards

<div align="center">

**Display server rankings and leaderboards**

[![Leaderboard](https://img.shields.io/npm/dw/modular?style=flat-square&logo=list)](leaderboard-cards.md)

</div>

Leaderboard cards display server rankings and leaderboards. They can show the top users in various categories like XP, levels, or custom metrics.

<div align="center">

![Leaderboard Preview](assets/@modulardark_transparent.png)

*Beautiful server leaderboards*

</div>

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Entries Configuration](#entries-configuration)
- [Customization](#customization)
- [Examples](#examples)
- [Styling Options](#styling-options)

---

## Overview

Leaderboard cards display ranked lists of users, commonly used for:

- XP leaderboards
- Level rankings
- Voice time rankings
- Custom metric leaderboards
- Weekly/monthly rankings

---

## Basic Usage

### Creating a Leaderboard Card

```javascript
const { createEngine } = require('modular');

const engine = createEngine();

const leaderboardCard = engine.createLeaderboardCard()
  .setGuild(guild)
  .setEntries([
    { rank: 1, user: user1, xp: 150000, level: 75 },
    { rank: 2, user: user2, xp: 125000, level: 65 },
    { rank: 3, user: user3, xp: 100000, level: 55 }
  ]);

await leaderboardCard.send(interaction);
```

### Top 10 Leaderboard

```javascript
const leaderboardCard = engine.createLeaderboardCard()
  .setGuild(interaction.guild)
  .setEntries(top10Users.map((user, index) => ({
    rank: index + 1,
    user: user,
    xp: user.xp,
    level: user.level
  })))
  .setTheme('midnight');

await leaderboardCard.send(interaction);
```

---

## Entries Configuration

### Basic Entry

```typescript
interface LeaderboardEntry {
  rank: number;        // Position (1, 2, 3, etc.)
  user: Discord.User;  // User object
  xp: number;          // XP value
  level?: number;      // Level (optional)
}
```

### Extended Entry

```typescript
interface ExtendedLeaderboardEntry {
  rank: number;
  user: Discord.User;
  xp: number;
  level?: number;
  score?: number;      // Custom score metric
  custom?: Record<string, any>; // Additional data
  change?: number;     // Rank change (+1, -1, etc.)
}
```

### Example with Extended Info

```javascript
const leaderboardCard = engine.createLeaderboardCard()
  .setGuild(guild)
  .setEntries([
    {
      rank: 1,
      user: user1,
      xp: 150000,
      level: 75,
      score: 1500,
      change: 0  // No change
    },
    {
      rank: 2,
      user: user2,
      xp: 125000,
      level: 65,
      score: 1250,
      change: 1  // Moved up 1 position
    },
    {
      rank: 3,
      user: user3,
      xp: 100000,
      level: 55,
      score: 1000,
      change: -2  // Moved down 2 positions
    }
  ]);
```

---

## Customization

### Highlight Specific User

```javascript
// Highlight current user's position
leaderboardCard.setHighlightRank(interaction.user.id);

// Highlight top 3
leaderboardCard.setHighlightRanks([1, 2, 3]);
```

### Show/Hide Avatars

```javascript
// Show user avatars
leaderboardCard.setShowAvatars(true);

// Hide user avatars
leaderboardCard.setShowAvatars(false);
```

### Set Max Entries

```javascript
// Show only top 5
leaderboardCard.setMaxEntries(5);

// Show top 10
leaderboardCard.setMaxEntries(10);
```

### Customize Columns

```javascript
leaderboardCard.setColumns([
  { field: 'rank', label: '#', width: 40 },
  { field: 'user', label: 'User', width: 200 },
  { field: 'level', label: 'Level', width: 80 },
  { field: 'xp', label: 'XP', width: 120 }
]);
```

---

## Examples

### Basic XP Leaderboard

```javascript
const leaderboardCard = engine.createLeaderboardCard()
  .setGuild(interaction.guild)
  .setEntries(
    users
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        user: user.discordUser,
        xp: user.xp,
        level: user.level
      }))
  )
  .setTheme('cyberpunk');

await leaderboardCard.send(interaction);
```

### Level Leaderboard with Highlights

```javascript
const leaderboardCard = engine.createLeaderboardCard()
  .setGuild(interaction.guild)
  .setEntries(topUsers.map((user, index) => ({
    rank: index + 1,
    user: user.discordUser,
    xp: user.xp,
    level: user.level
  })))
  .setTheme('dark')
  .setHighlightRank(interaction.user.id)
  .setShowAvatars(true)
  .setMaxEntries(10);

await leaderboardCard.send(interaction);
```

### Weekly Progress Leaderboard

```javascript
async function createWeeklyLeaderboard(guild) {
  const weeklyData = await getWeeklyXP(guild.id);

  const entries = weeklyData
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .slice(0, 10)
    .map((data, index) => ({
      rank: index + 1,
      user: data.user,
      xp: data.weeklyXp,
      level: data.level,
      change: data.change  // Position change from last week
    }));

  return engine.createLeaderboardCard()
    .setGuild(guild)
    .setEntries(entries)
    .setTheme('ocean')
    .setColumns([
      { field: 'rank', label: '#', width: 40 },
      { field: 'user', label: 'User', width: 180 },
      { field: 'xp', label: 'Weekly XP', width: 120 },
      { field: 'change', label: 'Change', width: 60 }
    ]);
}

const card = await createWeeklyLeaderboard(interaction.guild);
await card.send(interaction);
```

### Multi-Metric Leaderboard

```javascript
const leaderboardCard = engine.createLeaderboardCard()
  .setGuild(interaction.guild)
  .setEntries(users.map((user, index) => ({
    rank: index + 1,
    user: user.discordUser,
    xp: user.totalXp,
    level: user.level,
    voiceTime: user.voiceMinutes,
    custom: {
      messages: user.messageCount,
      invites: user.inviteCount
    }
  })))
  .setTheme('midnight')
  .setColumns([
    { field: 'rank', label: '#', width: 40 },
    { field: 'user', label: 'User', width: 150 },
    { field: 'level', label: 'Lvl', width: 50 },
    { field: 'xp', label: 'XP', width: 100 },
    { field: 'voiceTime', label: 'Voice', width: 80 }
  ]);

await leaderboardCard.send(interaction);
```

---

## Styling Options

### Column Styles

```javascript
card.setTokens({
  'column.header.background': '#1a1a2e',
  'column.header.text': '#00ffcc',
  'column.cell.background': 'transparent',
  'column.cell.text': '#ffffff',
  'column.alternate.background': 'rgba(255, 255, 255, 0.05)'
});
```

### Rank Badge Styles

```javascript
card.setTokens({
  'rank.size': 32,
  'rank.background': '#1a1a2e',
  'rank.gold.background': '#ffd700',
  'rank.silver.background': '#c0c0c0',
  'rank.bronze.background': '#cd7f32',
  'rank.text': '#ffffff'
});
```

### Avatar Styles

```javascript
card.setTokens({
  'avatar.size': 40,
  'avatar.border': '#00ffcc',
  'avatar.borderWidth': 2,
  'avatar.shape': 'circle'
});
```

### Text Styles

```javascript
card.setTokens({
  'text.fontFamily': 'Inter',
  'text.rank.size': 14,
  'text.rank.weight': 700,
  'text.user.size': 14,
  'text.user.weight': 500,
  'text.xp.size': 12,
  'text.xp.weight': 400,
  'text.primary': '#ffffff',
  'text.secondary': '#b3b3b3'
});
```

---

## Related Documentation

- [API Reference - Leaderboard Card](api-reference.md#leaderboard-card-specific-methods)
- [Theme System](themes.md)
- [Token System](api-reference.md#token-system)
- [Output Guide](output-guide.md)

<div align="center">

![Terms](assets/@modularterms.png)

*Rank your server members*

</div>
