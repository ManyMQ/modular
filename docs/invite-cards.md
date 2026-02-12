# Invite Cards

Invite cards display user invite statistics and tracking information. Perfect for servers that track member referrals and invitations.

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Invites Configuration](#invites-configuration)
- [Customization](#customization)
- [Examples](#examples)
- [Styling Options](#styling-options)

---

## Overview

Invite cards display invitation statistics, commonly used for:

- Invite tracking and rewards
- Referral programs
- Member count statistics
- Vanity URL tracking

---

## Basic Usage

### Creating an Invite Card

```javascript
const { createEngine } = require('modular');

const engine = createEngine();

const inviteCard = engine.createInviteCard()
  .setUser(user)
  .setInvites({
    total: 50,
    regular: 30,
    fake: 5,
    leaves: 10,
    bonus: 5
  });

await inviteCard.send(interaction);
```

### With Discord User

```javascript
const inviteCard = engine.createInviteCard()
  .setUser(interaction.user)
  .setInvites({
    total: 25,
    regular: 20,
    fake: 2,
    leaves: 3,
    bonus: 0
  });

await inviteCard.send(interaction);
```

---

## Invites Configuration

### Basic Invite Stats

```typescript
interface InviteStats {
  total: number;      // Total invites
  regular: number;    // Regular invites
  fake: number;       // Fake invites
  leaves: number;     // Left invites
  bonus: number;      // Bonus invites
}
```

### Extended Invite Stats

```typescript
interface ExtendedInviteStats {
  total: number;
  regular: number;
  fake: number;
  leaves: number;
  bonus: number;
  inviter?: Discord.User;  // Who invited this user
  invitedUsers?: Discord.User[];  // Users this person invited
  vanityCode?: string;     // Vanity URL code
  uses?: number;           // Vanity URL uses
}
```

### Example with Extended Info

```javascript
const inviteCard = engine.createInviteCard()
  .setUser(user)
  .setInvites({
    total: 50,
    regular: 30,
    fake: 5,
    leaves: 10,
    bonus: 5
  })
  .setInviter(inviterUser);
```

---

## Customization

### Show Inviter

```javascript
// Show who invited this user
inviteCard.setInviter(inviterUser);
```

### Vanity URL Stats

```javascript
// Add vanity URL information
inviteCard.setVanity({
  code: 'discord',
  uses: 1250
});
```

### Breakdown Display

```javascript
// Show detailed breakdown
inviteCard.setShowBreakdown(true);
inviteCard.setBreakdownColumns([
  { field: 'regular', label: 'Regular' },
  { field: 'fake', label: 'Fake' },
  { field: 'leaves', label: 'Left' },
  { field: 'bonus', label: 'Bonus' }
]);
```

---

## Examples

### Basic Invite Card

```javascript
const inviteCard = engine.createInviteCard()
  .setUser(interaction.user)
  .setInvites({
    total: 50,
    regular: 30,
    fake: 5,
    leaves: 10,
    bonus: 5
  })
  .setTheme('dark');

await inviteCard.send(interaction);
```

### Full Featured Invite Card

```javascript
const inviteCard = engine.createInviteCard()
  .setUser(interaction.user)
  .setInvites({
    total: 75,
    regular: 55,
    fake: 3,
    leaves: 12,
    bonus: 5
  })
  .setTheme('cyberpunk')
  .setShowBreakdown(true)
  .setBackground({
    type: 'gradient',
    colors: ['#1a1a2e', '#16213e'],
    direction: 'horizontal'
  })
  .setTokens({
    'text.fontFamily': 'Montserrat',
    'card.shadow': '0 4px 20px rgba(0, 255, 204, 0.3)'
  });

await inviteCard.send(interaction);
```

### Invite Leaderboard Card

```javascript
async function createInviteLeaderboard(guild) {
  const invites = await getServerInvites(guild.id);

  const sortedInvites = invites
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Create individual cards for each user
  const cards = await Promise.all(
    sortedInvites.slice(0, 3).map(async (inviteData, index) => {
      const card = engine.createInviteCard()
        .setUser(inviteData.user)
        .setInvites({
          total: inviteData.total,
          regular: inviteData.regular,
          fake: inviteData.fake,
          leaves: inviteData.leaves,
          bonus: inviteData.bonus
        })
        .setTheme(index === 0 ? 'gold' : 'cyberpunk');

      return { index: index + 1, buffer: await card.toBuffer() };
    })
  );

  return cards;
}

// Usage
const topInviters = await createInviteLeaderboard(interaction.guild);
```

### Vanity Stats Card

```javascript
const inviteCard = engine.createInviteCard()
  .setUser(interaction.user)
  .setVanity({
    code: 'discord',
    uses: interaction.guild.vanityURLUses
  })
  .setTheme('midnight');

await inviteCard.send(interaction);
```

---

## Styling Options

### Progress Bar Styles

```javascript
card.setTokens({
  'progress.height': 10,
  'progress.borderRadius': 5,
  'progress.regular.fill': '#10b981',
  'progress.fake.fill': '#ef4444',
  'progress.leaves.fill': '#f59e0b',
  'progress.bonus.fill': '#8b5cf6',
  'progress.background': 'rgba(255, 255, 255, 0.1)'
});
```

### Avatar Styles

```javascript
card.setTokens({
  'avatar.size': 80,
  'avatar.border': '#00ffcc',
  'avatar.borderWidth': 4,
  'avatar.shape': 'circle'
});
```

### Text Styles

```javascript
card.setTokens({
  'text.fontFamily': 'Montserrat',
  'text.total.size': 32,
  'text.total.weight': 700,
  'text.label.size': 14,
  'text.label.weight': 500,
  'text.primary': '#ffffff',
  'text.secondary': '#b3b3b3',
  'text.accent': '#00ffcc'
});
```

### Card Layout

```javascript
card.setTokens({
  'card.width': 600,
  'card.height': 200,
  'card.background': '#1a1a2e',
  'card.borderRadius': 16,
  'card.padding': 24,
  'card.shadow': '0 4px 6px rgba(0, 0, 0, 0.3)'
});
```

---

## Related Documentation

- [API Reference - Invite Card](api-reference.md#invite-card-specific-methods)
- [Theme System](themes.md)
- [Token System](api-reference.md#token-system)
- [Output Guide](output-guide.md)
