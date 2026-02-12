# Invite Cards

Create invite tracking cards for Discord bots.

## Basic Usage

```javascript
const { createEngine } = require('modul');

const engine = createEngine();

const inviteCard = engine.createInviteCard()
  .setUser(interaction.options.getUser('user'))
  .setInvites({
    total: 15,
    real: 12,
    fake: 2,
    leaves: 1,
    bonus: 0
  })
  .setGuild(interaction.guild)
  .setTheme('cyberpunk');

await inviteCard.reply(interaction);
```

## API

### setUser(user)

Set the Discord user.

```typescript
card.setUser(user: Discord.User)
```

### setInvites(invites)

Set invite statistics.

```typescript
interface InviteStats {
  total: number;
  real: number;
  fake: number;
  leaves: number;
  bonus: number;
}
card.setInvites(invites: InviteStats)
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

### setInviteCode(code)

Set a specific invite code to display.

```typescript
card.setInviteCode(code: string)
```

## Output Methods

| Method | Description |
|--------|-------------|
| `await card.reply(interaction)` | Reply to slash command |
| `await card.followUp(interaction)` | Follow-up message |
| `await card.toBuffer()` | Get PNG buffer |
| `await card.toStream()` | Get PNG stream |
