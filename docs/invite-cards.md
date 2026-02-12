# Invite Cards

<div align="center">

**Track server invite statistics**

[![Invite Cards](https://img.shields.io/npm/dw/modular?style=flat-square&logo=users)](invite-cards.md)

</div>

Invite cards display server invite statistics and track member invites. They show who invited the most members and track invite trends over time.

<div align="center">

![Invite Preview](assets/@modularlight_transparent.png)

*Track your server growth*

</div>

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Invite Data Structure](#invite-data-structure)
- [Customization](#customization)
- [Examples](#examples)
- [Styling Options](#styling-options)

---

## Overview

Invite cards are perfect for tracking and displaying:

- Top inviters in your server
- Invite counts per user
- Invite trends over time
- Real-time invite leaderboards
- Banners for invite tracking channels

---

## Basic Usage

### Creating an Invite Card

```javascript
const { createEngine } = require('modular');

const engine = createEngine();

const inviteCard = engine.createInviteCard()
  .setGuild(guild)
  .setInvites([
    { rank: 1, inviter: user1, total: 150, regular: 140, fake: 5, leave: 5 },
    { rank: 2, inviter: user2, total: 125, regular: 120, fake: 3, leave: 2 },
    { rank: 3, inviter: user3, total: 100, regular: 95, fake: 3, leave: 2 }
  ]);

await inviteCard.send(interaction);
```

### Server-wide Invite Stats

```javascript
const inviteCard = engine.createInviteCard()
  .setGuild(interaction.guild)
  .setInvites(allInvites)
  .setTheme('dark');

await inviteCard.send(interaction);
```

---

## Invite Data Structure

### Basic Invite Data

```typescript
interface InviteData {
  rank: number;            // Position (1, 2, 3, etc.)
  inviter: Discord.User;   // User object
  total: number;           // Total invites
  regular?: number;        // Regular invites
  fake?: number;           // Fake invites (bonus)
  leave?: number;          // Members who left
}
```

### Extended Invite Data

```typescript
interface ExtendedInviteData {
  rank: number;
  inviter: Discord.User;
  total: number;
  regular: number;
  fake: number;
  leave: number;
  bonus?: number;          // Bonus points
  inviterName?: string;    // Custom name display
  custom?: Record<string, any>;
}
```

### Example with Extended Data

```javascript
const inviteCard = engine.createInviteCard()
  .setGuild(guild)
  .setInvites([
    {
      rank: 1,
      inviter: user1,
      total: 150,
      regular: 140,
      fake: 5,
      leave: 5,
      bonus: 10,
      inviterName: 'TopInviter'
    },
    {
      rank: 2,
      inviter: user2,
      total: 125,
      regular: 120,
      fake: 3,
      leave: 2,
      bonus: 5
    }
  ]);
```

---

## Customization

### Highlight Specific Inviter

```javascript
// Highlight current user's invites
inviteCard.setHighlightUser(interaction.user.id);

// Highlight top 3
inviteCard.setHighlightUsers([user1.id, user2.id, user3.id]);
```

### Show/Hide Avatars

```javascript
// Show inviter avatars
inviteCard.setShowAvatars(true);

// Hide inviter avatars
inviteCard.setShowAvatars(false);
```

### Set Max Entries

```javascript
// Show only top 5
inviteCard.setMaxEntries(5);

// Show top 10
inviteCard.setMaxEntries(10);
```

### Customize Columns

```javascript
inviteCard.setColumns([
  { field: 'rank', label: '#', width: 40 },
  { field: 'inviter', label: 'Inviter', width: 180 },
  { field: 'total', label: 'Total', width: 80 },
  { field: 'regular', label: 'Regular', width: 80 },
  { field: 'leave', label: 'Left', width: 60 }
]);
```

### Time Period Filtering

```javascript
// Weekly invites only
inviteCard.setTimePeriod('weekly');

// Monthly invites only
inviteCard.setTimePeriod('monthly');

// All time
inviteCard.setTimePeriod('alltime');
```

---

## Examples

### Basic Invite Leaderboard

```javascript
const inviteCard = engine.createInviteCard()
  .setGuild(interaction.guild)
  .setInvites(
    users
      .sort((a, b) => b.invites - a.invites)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        inviter: user.discordUser,
        total: user.invites,
        regular: user.regularInvites,
        fake: user.fakeInvites,
        leave: user.leaveCount
      }))
  )
  .setTheme('neon');

await inviteCard.send(interaction);
```

### Weekly Invite Competition

```javascript
async function createWeeklyInvites(guild) {
  const weeklyInvites = await getWeeklyInvites(guild.id);

  const entries = weeklyInvites
    .sort((a, b) => b.weeklyInvites - a.weeklyInvites)
    .slice(0, 10)
    .map((data, index) => ({
      rank: index + 1,
      inviter: data.user,
      total: data.weeklyInvites,
      regular: data.weeklyRegular,
      fake: data.weeklyFake,
      leave: data.weeklyLeft
    }));

  return engine.createInviteCard()
    .setGuild(guild)
    .setEntries(entries)
    .setTheme('cyberpunk')
    .setTimePeriod('weekly')
    .setColumns([
      { field: 'rank', label: '#', width: 40 },
      { field: 'inviter', label: 'Inviter', width: 150 },
      { field: 'total', label: 'Weekly', width: 80 },
      { field: 'regular', label: 'Reg', width: 50 },
      { field: 'leave', label: 'Left', width: 50 }
    ]);
}

const card = await createWeeklyInvites(interaction.guild);
await card.send(interaction);
```

### Invite Stats with Bonus

```javascript
const inviteCard = engine.createInviteCard()
  .setGuild(interaction.guild)
  .setEntries(inviteData.map((data, index) => ({
    rank: index + 1,
    inviter: data.user,
    total: data.total,
    regular: data.regular,
    fake: data.fake,
    leave: data.left,
    bonus: data.bonus
  })))
  .setTheme('dark')
  .setColumns([
    { field: 'rank', label: '#', width: 40 },
    { field: 'inviter', label: 'Inviter', width: 180 },
    { field: 'total', label: 'Total', width: 80 },
    { field: 'bonus', label: 'Bonus', width: 70 }
  ])
  .setHighlightUser(interaction.user.id);

await inviteCard.send(interaction);
```

### Invite Tracking Channel Banner

```javascript
// Create a banner-style invite card
const bannerCard = engine.createInviteCard()
  .setGuild(guild)
  .setEntries(topInviters.slice(0, 5))
  .setTheme('banner')
  .setStyle('banner')
  .setBackground({
    type: 'image',
    url: 'https://example.com/banner-bg.jpg'
  });

// Send to invite tracking channel
await bannerCard.send(inviteChannel);
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
  'text.count.size': 12,
  'text.count.weight': 400,
  'text.primary': '#ffffff',
  'text.secondary': '#b3b3b3'
});
```

### Special Columns

```javascript
card.setTokens({
  'bonus.column.background': 'rgba(255, 215, 0, 0.1)',
  'bonus.column.text': '#ffd700',
  'bonus.column.border': '#ffd700'
});
```

---

## Related Documentation

- [API Reference - Invite Card](api-reference.md#invite-card-specific-methods)
- [Theme System](themes.md)
- [Token System](api-reference.md#token-system)
- [Output Guide](output-guide.md)

<div align="center">

![Terms](assets/@modularterms.png)

*See who's growing your community*

</div>
