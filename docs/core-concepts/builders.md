# Card Builders

`@reformlabs/modular` ships six specialized builder classes. Each wraps the base `CardBuilder` with card-type-specific methods while preserving the full fluent API.

---

## Common Base Methods

All builders inherit these from `CardBuilder`:

| Method | Returns | Description |
|:-------|:--------|:-----------|
| `.setUser(discordUser)` | `this` | Populate from a Discord.js `User` or `GuildMember` |
| `.setUsername(string)` | `this` | Set username directly |
| `.setAvatar(url)` | `this` | Set avatar URL |
| `.setTheme(name)` | `this` | Set visual theme |
| `.setDpi(1–4)` | `this` | Set DPI scaling |
| `.setSize(w, h)` | `this` | Set card dimensions (max 4096×4096) |
| `.setTokens(map)` | `this` | Override design tokens |
| `.setToken(name, value)` | `this` | Override a single token |
| `.setColors(map)` | `this` | Override color tokens |
| `.addEffect(type, opts)` | `this` | Add a post-process FX effect |
| `.setGlow(enabled, color, blur)` | `this` | Enable/disable glow effect |
| `.setBackground(config)` | `this` | Set background config |
| `.setData(map)` | `this` | Set arbitrary data fields |
| `.setLayout(layout)` | `this` | Set raw layout definition |
| `.addComponent(type, props)` | `this` | Add a component to the layout |
| `.render(opts?)` | `Promise<Buffer>` | Render to PNG buffer |
| `.toBuffer(opts?)` | `Promise<Buffer>` | Alias for `.render()` |
| `.reply(interaction, opts?)` | `Promise<void>` | Reply to a Discord interaction |
| `.followUp(interaction, opts?)` | `Promise<void>` | Follow-up to an interaction |
| `.send(channel, opts?)` | `Promise<Message>` | Send to a channel |
| `.getConfig()` | `Object` | Inspect current config |

---

## RankCard

**Import:** `import { RankCard } from '@reformlabs/modular'`  
**Factory:** `engine.createRankCard()`

Renders a Discord leveling rank card with XP bar, level badge, and rank position.

### Specific Methods

| Method | Description |
|:-------|:-----------|
| `.setStats(stats)` | Set XP, level, rank, maxXp |
| `.setGuild(guild)` | Set guild name and icon |

### `.setStats(stats)`

```ts
stats: {
  level?: number;   // Current level (default: 1)
  rank?: number;    // Rank position (default: 0)
  xp?: number;      // Current XP (default: 0)
  maxXp?: number;   // XP for next level (default: 1000)
  requiredXP?: number; // Alias for maxXp
  score?: number;   // Optional score value
}
```

```js
card.setStats({ level: 15, rank: 3, xp: 7300, maxXp: 10000 });
```

### Full Example

```js
import { RankCard } from '@reformlabs/modular';

const buffer = await new RankCard()
  .setUser(discordUser)
  .setStats({ level: 15, rank: 3, xp: 7300, maxXp: 10000 })
  .setTheme('neon-tech')
  .setDpi(2)
  .render();

// Reply directly to a slash command:
await new RankCard()
  .setUser(interaction.user)
  .setStats(await db.getUserStats(interaction.user.id))
  .setTheme('cyberpunk')
  .reply(interaction);
```

---

## ProfileCard

**Import:** `import { ProfileCard } from '@reformlabs/modular'`  
**Factory:** `engine.createProfileCard()`

Full feature set — see [ProfileCard API Reference](../api/profile-card.md).

### Quick Example

```js
import { ProfileCard } from '@reformlabs/modular';

const buffer = await new ProfileCard()
  .setUser(discordUser)
  .setJoinDate(member.joinedAt)
  .setBadgeIds([1, 3, 7])
  .setPrimaryColor([108, 123, 255])
  .setStatus('dnd')
  .setRankData({ currentXP: 4200, requiredXP: 10000, level: 12, rank: 3 })
  .setTheme('glass-modern')
  .render();
```

---

## MusicCard

**Import:** `import { MusicCard } from '@reformlabs/modular'`  
**Factory:** `engine.createMusicCard()`

Renders a Now Playing card with album art, progress bar, artist, and playback state.

### Specific Methods

| Method | Description |
|:-------|:-----------|
| `.setTrack(track)` | Set track metadata |

### `.setTrack(track)`

```ts
track: {
  title: string;           // Track title
  artist?: string;         // Artist name
  thumbnail?: string;      // Album art URL (alias: image, albumArt)
  duration?: number;       // Total duration in seconds
  currentTime?: number;    // Current playback position in seconds
  isPlaying?: boolean;     // Playback state (default: true)
  paused?: boolean;        // Paused state
}
```

```js
card.setTrack({
  title: 'Midnight City',
  artist: 'M83',
  thumbnail: 'https://cdn.example.com/album.jpg',
  duration: 243,
  currentTime: 61,
  isPlaying: true
});
```

### Full Example

```js
import { MusicCard } from '@reformlabs/modular';

const buffer = await new MusicCard()
  .setUser(discordUser)
  .setTrack({
    title: 'Midnight City',
    artist: 'M83',
    thumbnail: 'https://cdn.example.com/album.jpg',
    duration: 243,
    currentTime: 61,
    isPlaying: true
  })
  .setTheme('glass-modern')
  .render();
```

---

## Leaderboard

**Import:** `import { Leaderboard } from '@reformlabs/modular'`  
**Factory:** `engine.createLeaderboardCard()`

Renders a server leaderboard with up to N ranked entries.

### Specific Methods

| Method | Description |
|:-------|:-----------|
| `.setLeaderboard(data)` | Set title, entries, and season |

### `.setLeaderboard(data)`

```ts
data: {
  title?: string;     // Leaderboard title (default: 'Leaderboard')
  subtitle?: string;  // Subtitle (default: 'Top Players')
  entries: Array<{
    rank?: number;
    username: string;
    avatar?: string;
    xp?: number;
    level?: number;
    score?: number;
  }>;
  season?: string;    // Season label (e.g., 'Season 4')
}
```

### Full Example

```js
import { Leaderboard } from '@reformlabs/modular';

const topUsers = await db.getTopUsers(10);

const buffer = await new Leaderboard()
  .setLeaderboard({
    title: 'Top Members',
    subtitle: 'Season 4',
    entries: topUsers.map((u, i) => ({
      rank: i + 1,
      username: u.username,
      avatar: u.avatarURL,
      xp: u.xp,
      level: u.level
    }))
  })
  .setTheme('esport')
  .render();
```

---

## InviteCard

**Import:** `import { InviteCard } from '@reformlabs/modular'`  
**Factory:** `engine.createInviteCard()`

Renders an invite statistics card showing invites, valid joins, rewards, and milestone progress.

### Specific Methods

| Method | Description |
|:-------|:-----------|
| `.setInvite(data)` | Set invite statistics |

### `.setInvite(data)`

```ts
data: {
  invites?: number;           // Total invites sent (default: 0)
  valid?: number;             // Valid (stayed) invites (default: 0)
  rewards?: number;           // Rewards earned (default: 0)
  milestoneProgress?: number; // Progress toward next milestone (default: 0)
  milestoneMax?: number;      // Milestone target (default: 250)
}
```

### Full Example

```js
import { InviteCard } from '@reformlabs/modular';

const inviteData = await inviteTracker.getStats(user.id);

const buffer = await new InviteCard()
  .setUser(discordUser)
  .setInvite({
    invites: inviteData.total,
    valid: inviteData.valid,
    rewards: inviteData.rewards,
    milestoneProgress: inviteData.total,
    milestoneMax: 50
  })
  .setTheme('minimal-developer')
  .render();
```

---

## WelcomeCard

**Import:** `import { WelcomeCard } from '@reformlabs/modular'`  
**Factory:** `engine.createWelcomeCard()`

Renders a server welcome card with the new member's avatar, username, and guild info.

### Specific Methods

| Method | Description |
|:-------|:-----------|
| `.setGuild(guild)` | Set guild name, icon, and member count |
| `.setTitle(text)` | Set the welcome headline |
| `.setSubtitle(text)` | Set the welcome subtitle |

### Full Example

```js
import { WelcomeCard } from '@reformlabs/modular';

client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.systemChannel;
  if (!channel) return;

  await new WelcomeCard()
    .setUser(member.user)
    .setGuild(member.guild)
    .setTitle(`Welcome, ${member.user.username}!`)
    .setSubtitle(`You are member #${member.guild.memberCount}`)
    .setTheme('glass-modern')
    .send(channel, { filename: 'welcome.png' });
});
```

---

## Discord.js Integration Helpers

All builders include three methods for sending cards directly to Discord:

### `.reply(interaction, options?)`

Handles both initial replies and deferred/edited replies automatically.

```js
// In a slash command:
await new RankCard()
  .setUser(interaction.user)
  .setStats(stats)
  .reply(interaction, { ephemeral: false });
```

### `.followUp(interaction, options?)`

Sends a follow-up message to an already-replied interaction.

```js
await card.followUp(interaction, { ephemeral: true });
```

### `.send(channel, options?)`

Sends to a `TextChannel` or `DMChannel`.

```js
await card.send(channel, { filename: 'rank.png' });
```

### Options for all three:

```ts
{
  filename?: string;    // Attachment filename (default: '<preset>.png')
  ephemeral?: boolean;  // Ephemeral reply (default: false) — reply/followUp only
}
```
