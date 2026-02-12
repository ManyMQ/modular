# Leaderboard Cards

Create server ranking cards for Discord bots.

## Basic Usage

```javascript
const { createEngine } = require('modul');

const engine = createEngine();

const leaderboardCard = engine.createLeaderboardCard()
  .setEntries([
    { user: user1, xp: 150000, level: 75, rank: 1 },
    { user: user2, xp: 125000, level: 62, rank: 2 },
    { user: user3, xp: 100000, level: 50, rank: 3 },
    { user: user4, xp: 75000, level: 38, rank: 4 },
    { user: user5, xp: 50000, level: 25, rank: 5 }
  ])
  .setGuild(interaction.guild)
  .setTheme('cyberpunk');

await leaderboardCard.reply(interaction);
```

## API

### setEntries(entries)

Set leaderboard entries.

```typescript
interface LeaderboardEntry {
  user: Discord.User;
  xp: number;
  level: number;
  rank: number;
}
card.setEntries(entries: LeaderboardEntry[])
```

### setOptions(options)

Configure leaderboard display.

```typescript
interface LeaderboardOptions {
  title?: string;
  showXp?: boolean;
  showLevel?: boolean;
  showRank?: boolean;
  maxEntries?: number;
  highlightUser?: Discord.User;
}
card.setOptions(options: LeaderboardOptions)
```

### setGuild(guild)

Set the Discord guild.

```typescript
card.setGuild(guild: Discord.Guild)
```

### setTheme(name)

Apply a theme.

```typescript
card.setTheme(name: string)
```

## Output Methods

| Method | Description |
|--------|-------------|
| `await card.reply(interaction)` | Reply to slash command |
| `await card.followUp(interaction)` | Follow-up message |
| `await card.toBuffer()` | Get PNG buffer |
| `await card.toStream()` | Get PNG stream |
