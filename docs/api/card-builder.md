# CardBuilder API Reference

![Documentation](../assets/@modulardocumentation.png)

[← Back: System Architecture](../core-concepts/system-architecture.md) | [Next: Theme Engine API →](./theme-engine.md)

---

`CardBuilder` is the **base class** inherited by all six specialized builders (`RankCard`, `ProfileCard`, `MusicCard`, `Leaderboard`, `InviteCard`, `WelcomeCard`). Every method documented here is available on all builders.

---

## Size & DPI

### `.setSize(width, height)` → `this`

Sets the logical card dimensions. Applied to all subsequent `.render()` calls from this builder.

| Parameter | Type | Range | Description |
|:----------|:-----|:------|:-----------|
| `width` | `number` | 1–4096 | Logical width in pixels |
| `height` | `number` | 1–4096 | Logical height in pixels |

Throws `ValidationError` if either value is outside 1–4096.

```js
card.setSize(930, 280);
```

---

### `.setDpi(dpi)` → `this`

Sets the DPI scaling for this builder. Physical canvas size = logical size × DPI.

| Parameter | Type | Range | Description |
|:----------|:-----|:------|:-----------|
| `dpi` | `number` | 1–4 | DPI multiplier |

Throws `ValidationError` if value is outside 1–4.

```js
card.setDpi(2); // default — retina-ready
card.setDpi(1); // faster render, smaller file
```

---

## Theme & Tokens

### `.setTheme(themeName)` → `this`

Sets the visual theme for this card. Must be a registered theme ID.

```js
card.setTheme('neon-tech');
card.setTheme('glass-modern');
card.setTheme('my-custom-theme');
```

Throws `Error` if `themeName` is not a non-empty string. Falls back to `'default'` at render time if the theme is not registered.

---

### `.setToken(name, value)` → `this`

Overrides a single design token for this card only.

```js
card.setToken('colors.accent.primary', '#ff6b6b');
card.setToken('colors.text.primary', '#f0f0f0');
```

Token names use dot-path notation matching the theme structure.

---

### `.setTokens(tokens)` → `this`

Overrides multiple design tokens at once.

```js
card.setTokens({
  'colors.accent.primary': '#ff6b6b',
  'colors.accent.glow': 'rgba(255, 107, 107, 0.4)'
});
```

---

### `.setColors(colorMap)` → `this`

Convenience wrapper for overriding nested color tokens via a structured object (automatically flattened to dot-path tokens).

```js
card.setColors({
  surface: { primary: '#0a0a0a' },
  accent: { primary: '#ff6b6b' }
});
// Equivalent to:
card.setTokens({
  'color.surface.primary': '#0a0a0a',
  'color.accent.primary': '#ff6b6b'
});
```

---

## User & Data

### `.setUser(discordUser)` → `this`

Populates card data from a Discord.js `User` or `GuildMember` object. Automatically extracts username, tag, avatar URL, status, and banner.

```js
card.setUser(interaction.user);
card.setUser(member); // GuildMember also works
```

Fields extracted:
- `username` — `user.username`
- `discriminator` — `user.discriminator` or from `user.tag`
- `tag` — `user.tag`
- `avatar` — `user.displayAvatarURL({ format: 'png', size: 256 })`
- `status` — `user.status`
- `banner` — `user.bannerURL()`
- `displayName` — `user.displayName ?? user.username`

---

### `.setUsername(username)` → `this`

Sets the username string directly (without needing a Discord.js User object).

```js
card.setUsername('Senior Developer');
```

---

### `.setAvatar(url)` → `this`

Sets the avatar image URL directly.

```js
card.setAvatar('https://cdn.discordapp.com/avatars/123/abc.png');
```

---

### `.setGuild(guild)` → `this`

Populates guild data from a Discord.js `Guild` object.

Fields extracted: `guildName`, `guildIcon`, `memberCount`, `guildId`.

```js
card.setGuild(interaction.guild);
```

---

### `.setTitle(title)` → `this`

Sets a primary title string on the card data.

```js
card.setTitle('Welcome to the Server!');
```

---

### `.setSubtitle(subtitle)` → `this`

Sets a secondary subtitle string.

```js
card.setSubtitle('You are member #1,337');
```

---

### `.setData(dataMap)` → `this`

Merges arbitrary key-value pairs into the card data object. Used internally by all specific setters. Useful for passing custom data to custom renderers.

```js
card.setData({ myCustomField: 'hello', memberNumber: 42 });
```

---

### `.setStats(stats)` → `this`

Sets XP and level statistics (used by `RankCard` and optionally `ProfileCard`).

```ts
stats: {
  level?: number;     // Current level (default: 1)
  rank?: number;      // Rank position (default: 0)
  xp?: number;        // Current XP (default: 0)
  maxXp?: number;     // XP required for next level (default: 1000)
  requiredXP?: number; // Alias for maxXp
  score?: number;     // Optional score value
}
```

Automatically computes `progress` as `(xp / maxXp) * 100`.

```js
card.setStats({ level: 15, rank: 3, xp: 7300, maxXp: 10000 });
```

---

### `.setTrack(track)` → `this`

Sets music track metadata (used by `MusicCard`).

```ts
track: {
  title: string;
  artist?: string;
  thumbnail?: string;  // alias: image, albumArt
  duration?: number;   // seconds
  currentTime?: number; // seconds
  isPlaying?: boolean; // default: true
  paused?: boolean;
}
```

```js
card.setTrack({ title: 'Midnight City', artist: 'M83', duration: 243, currentTime: 61, isPlaying: true });
```

---

### `.setLeaderboard(data)` → `this`

Sets leaderboard data (used by `Leaderboard`).

```ts
data: {
  title?: string;
  subtitle?: string;
  entries: Array<{ rank?: number; username: string; avatar?: string; xp?: number; level?: number; score?: number }>;
  season?: string;
}
```

---

### `.setInvite(data)` → `this`

Sets invite statistics (used by `InviteCard`).

```ts
data: {
  invites?: number;
  valid?: number;
  rewards?: number;
  milestoneProgress?: number;
  milestoneMax?: number; // default: 250
}
```

---

## Layout & Components

### `.setLayout(layout)` → `this`

Replaces the preset layout with a custom layout definition object (JSON DSL). Clears the current preset.

```js
card.setLayout({
  type: 'container',
  children: [
    { type: 'avatar', props: { x: 20, y: 20, size: 80 } },
    { type: 'text', props: { text: '{username}', x: 120, y: 40 } }
  ]
});
```

---

### `.setPreset(preset, options?)` → `this`

Switches to a named preset layout. Valid presets: `'rank'`, `'music'`, `'leaderboard'`, `'invite'`, `'profile'`, `'welcome'`.

```js
card.setPreset('rank');
```

Throws `ValidationError` if preset is not one of the valid names.

---

### `.addComponent(type, props?, slot?)` → `this`

Appends a component to the layout's children array (or to a named slot).

```js
card.addComponent('text', { text: 'Custom Label', x: 10, y: 10 });
card.addComponent('avatar', { size: 80 }, 'header'); // into 'header' slot
```

---

## Effects & Background

### `.addEffect(type, options?)` → `this`

Adds a post-processing effect to the FX pass.

| `type` | Description |
|:-------|:-----------|
| `'glow'` | Canvas shadow blur overlay |
| `'blur'` | Global blur pass |
| `'shadow'` | Drop shadow |
| `'gradient'` | Gradient overlay |

```js
card.addEffect('glow', { color: '#00f0ff', blur: 30 });
```

---

### `.setGlow(enabled?, color?, blur?)` → `this`

Convenience method for the `glow` effect. Removes any previous glow before applying.

```js
card.setGlow(true, '#7c3aed', 25);
card.setGlow(false); // disable glow
```

---

### `.setBackground(config)` → `this`

Sets the card background configuration.

```js
card.setBackground({ color: '#0a0a0f' });
card.setBackground({ gradient: '#7c3aed', color: '#0a0a0f' });
```

---

## Render & Export

### `.render(options?)` → `Promise<Buffer>`

Executes the full 9-phase render pipeline and returns a `Buffer`.

```ts
options?: {
  width?: number;      // Override width for this call only
  height?: number;     // Override height for this call only
  dpi?: number;        // Override DPI for this call only
  format?: 'png' | 'jpeg' | 'webp'; // Default: 'png'
  quality?: number;    // 0.0–1.0 for jpeg/webp
}
```

```js
const png  = await card.render();
const jpeg = await card.render({ format: 'jpeg', quality: 0.85 });
const webp = await card.render({ format: 'webp', quality: 0.9 });
const thumb = await card.render({ width: 400, height: 200, dpi: 1 });
```

---

### `.toBuffer(options?)` → `Promise<Buffer>`

Alias for `.render()`. Identical behavior.

---

### `.reply(interaction, options?)` → `Promise<void>`

Renders the card and replies to a Discord.js interaction. Handles both initial replies and deferred/edited states automatically.

```ts
options?: {
  filename?: string;    // Default: '<preset>.png'
  ephemeral?: boolean;  // Default: false
}
```

```js
await card.reply(interaction);
await card.reply(interaction, { ephemeral: true, filename: 'rank.png' });
```

---

### `.followUp(interaction, options?)` → `Promise<void>`

Renders and sends a follow-up message to an already-replied interaction.

```js
await card.followUp(interaction, { ephemeral: true });
```

---

### `.send(channel, options?)` → `Promise<Message>`

Renders and sends the card to a Discord channel. Returns the sent `Message` object.

```ts
options?: {
  filename?: string; // Default: '<preset>.png'
}
```

```js
const msg = await card.send(channel, { filename: 'welcome.png' });
```

---

## Debugging

### `.getConfig()` → `Object`

Returns a shallow copy of the builder's current configuration object. Useful for debugging.

```js
console.log(card.getConfig());
// { width, height, dpi, theme, preset, layout, tokens, data, effects }
```

### `.toString()` → `string`

```js
console.log(card.toString());
// 'CardBuilder[rank]'
```

### `.toJSON()` → `Object`

Returns a structured JSON representation of the builder state.

---

## Error Reference

| Error | Thrown By | Condition |
|:------|:---------|:---------|
| `ValidationError` | `.setSize()` | width or height outside 1–4096 |
| `ValidationError` | `.setDpi()` | dpi outside 1–4 |
| `ValidationError` | `.setPreset()` | unknown preset name |
| `Error` | `.setTheme()` | theme name is empty or not a string |
| `ComponentError` | `.render()` | unknown component type in layout |

---

[Next: Theme Engine API →](./theme-engine.md)
