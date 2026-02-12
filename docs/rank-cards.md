# Rank Cards

Create level/XP progress cards for Discord servers.

## Basic Usage

```javascript
const { createEngine } = require('modul');

const engine = createEngine();

const rankCard = engine.createRankCard()
  .setUser(interaction.options.getUser('user'))
  .setStats({
    level: 50,
    xp: 7500,
    maxXp: 10000,
    rank: 5,
    totalXp: 250000
  })
  .setGuild(interaction.guild)
  .setTheme('cyberpunk');

await rankCard.reply(interaction);
```

## API

### setUser(user)

Set the Discord user for the card.

```typescript
card.setUser(user: Discord.User)
```

### setStats(stats)

Set rank statistics.

```typescript
interface RankStats {
  level: number;
  xp: number;
  maxXp: number;
  rank: number;
  totalXp?: number;
}
card.setStats(stats: RankStats)
```

### setGuild(guild)

Set the Discord guild for role color lookup.

```typescript
card.setGuild(guild: Discord.Guild)
```

### setTheme(name)

Apply a theme to the card.

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
| `await card.render()` | Render and return buffer |
