# API Reference

<div align="center">

**Complete API reference for the Modular rendering engine**

[![Version](https://img.shields.io/npm/v/modular?style=flat-square&logo=npm)](https://npmjs.com/package/modular)
[![TypeScript](https://img.shields.io/npm/types/modular?style=flat-square&logo=typescript)](https://typescriptlang.org)

</div>

Complete API reference for the Modular rendering engine.

## Table of Contents

- [Engine](#engine)
  - [createEngine](#createengineoptions)
- [Engine Methods](#engine-methods)
- [Card Builders](#card-builders)
  - [Common Methods](#common-card-builder-methods)
  - [Rank Card Methods](#rank-card-specific-methods)
  - [Music Card Methods](#music-card-specific-methods)
  - [Leaderboard Card Methods](#leaderboard-card-specific-methods)
  - [Invite Card Methods](#invite-card-specific-methods)
  - [Profile Card Methods](#profile-card-specific-methods)
  - [Welcome Card Methods](#welcome-card-specific-methods)
- [Theme System](#theme-system)
- [Token System](#token-system)
- [Plugin System](#plugin-system)
- [Component Registry](#component-registry)
- [Rendering](#rendering)
- [Performance APIs](#performance-apis)
- [Types](#types)

---

## Engine

### createEngine(options)

Creates a new engine instance with optional configuration.

```typescript
function createEngine(options?: EngineOptions): Engine
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| options | EngineOptions | No | - | Configuration options |

**EngineOptions:**

```typescript
interface EngineOptions {
  // Render DPI (higher = better quality, more memory)
  dpi?: number;              // Default: 2

  // Cache configuration
  cache?: {
    maxSize: number;         // Default: 100
    maxAge?: number;         // Default: 3600000 (1 hour)
  };

  // Enable debug logging
  debug?: boolean;           // Default: false

  // Enable canvas rendering
  canvas?: boolean;         // Default: true

  // Default theme name
  defaultTheme?: string;    // Default: 'dark'

  // Font configuration
  fonts?: {
    default?: string;        // Default: 'Inter'
    path?: string;          // Custom font directory
  };
}
```

**Example:**

```javascript
const engine = createEngine({
  dpi: 2,
  cache: { maxSize: 100 },
  debug: false,
  defaultTheme: 'cyberpunk'
});
```

---

## Engine Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `createRankCard()` | RankCardBuilder | Create a new rank card builder |
| `createMusicCard()` | MusicCardBuilder | Create a new music card builder |
| `createLeaderboardCard()` | LeaderboardCardBuilder | Create a new leaderboard builder |
| `createInviteCard()` | InviteCardBuilder | Create a new invite tracker builder |
| `createProfileCard()` | ProfileCardBuilder | Create a new profile card builder |
| `createWelcomeCard()` | WelcomeCardBuilder | Create a new welcome card builder |
| `themes.register(name, theme)` | void | Register a custom theme |
| `themes.get(name)` | Theme | Get a theme by name |
| `themes.apply(name)` | void | Apply a theme |
| `themes.list()` | string[] | List all registered themes |
| `tokens.set(key, value)` | void | Set a global design token |
| `tokens.get(key)` | any | Get a global token value |
| `tokens.merge(tokens)` | void | Merge multiple tokens |
| `plugins.register(plugin)` | void | Register a plugin |
| `plugins.get(name)` | Plugin | Get a plugin by name |
| `plugins.list()` | string[] | List all registered plugins |
| `components.register(name, component)` | void | Register a component |
| `components.get(name)` | Component | Get a component by name |
| `cache.clear()` | void | Clear the asset cache |
| `cache.getStats()` | CacheStats | Get cache statistics |
| `fonts.register(fontConfig)` | void | Register a custom font |

---

## Card Builders

### Common Card Builder Methods

All card builders support these methods:

```typescript
interface BaseCardBuilder {
  // User & Guild
  setUser(user: Discord.User): this;
  setGuild(guild: Discord.Guild): this;

  // Styling
  setTheme(name: string): this;
  setTokens(tokens: Record<string, any>): this;
  setBackground(config: BackgroundConfig): this;
  setOptions(options: CardOptions): this;

  // Rendering
  toBuffer(): Promise<Buffer>;
  toStream(): Promise<Stream>;
  render(): Promise<Buffer>;

  // Discord Integration
  send(interaction: Interaction): Promise<Message>;
  reply(interaction: Interaction): Promise<Message>;
  followUp(interaction: Interaction, options?: object): Promise<Message>;
}
```

#### setUser()

```typescript
card.setUser(user: Discord.User): this
```

Set the user for the card.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| user | Discord.User | The Discord user object |

**Example:**

```javascript
card.setUser(interaction.user);
```

#### setGuild()

```typescript
card.setGuild(guild: Discord.Guild): this
```

Set the guild/server for the card.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| guild | Discord.Guild | The Discord guild object |

**Example:**

```javascript
card.setGuild(interaction.guild);
```

#### setTheme()

```typescript
card.setTheme(name: string): this
```

Apply a theme to the card.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | string | Theme name |

**Example:**

```javascript
card.setTheme('cyberpunk');
```

#### setTokens()

```typescript
card.setTokens(tokens: Record<string, any>): this
```

Set design tokens for the card.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| tokens | Record<string, any> | Token key-value pairs |

**Example:**

```javascript
card.setTokens({
  'card.background': '#1a1a2e',
  'text.primary': '#00ffcc',
  'progress.fill': '#ff00ff'
});
```

#### setBackground()

```typescript
card.setBackground(config: BackgroundConfig): this
```

Set the card background.

**BackgroundConfig:**

```typescript
interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image';
  value?: string;           // color hex or image URL
  colors?: string[];        // gradient colors
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  opacity?: number;         // 0-1
}
```

**Example:**

```javascript
// Solid color
card.setBackground({ type: 'color', value: '#1a1a2e' });

// Gradient
card.setBackground({
  type: 'gradient',
  colors: ['#667eea', '#764ba2'],
  direction: 'horizontal'
});

// Image
card.setBackground({
  type: 'image',
  value: 'https://example.com/bg.jpg',
  opacity: 0.5
});
```

#### toBuffer()

```typescript
card.toBuffer(): Promise<Buffer>
```

Render the card and return as PNG buffer.

**Returns:** Promise\<Buffer> - PNG image buffer

**Example:**

```javascript
const buffer = await card.toBuffer();
fs.writeFileSync('card.png', buffer);
```

#### toStream()

```typescript
card.toStream(): Promise<Stream>
```

Render the card and return as PNG stream.

**Returns:** Promise\<Stream> - Readable stream

**Example:**

```javascript
const stream = await card.toStream();
const attachment = new AttachmentBuilder(stream, { name: 'card.png' });
await interaction.reply({ files: [attachment] });
```

#### send()

```typescript
card.send(interaction: Interaction): Promise<Message>
```

Send the card as a new message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| interaction | Interaction | Discord interaction |

**Returns:** Promise\<Message> - The sent message

**Example:**

```javascript
await card.send(interaction);
```

#### reply()

```typescript
card.reply(interaction: Interaction): Promise<Message>
```

Reply to the interaction with the card.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| interaction | Interaction | Discord interaction |

**Returns:** Promise\<Message> - The reply message

**Example:**

```javascript
await card.reply(interaction);
```

#### followUp()

```typescript
card.followUp(interaction: Interaction, options?: object): Promise<Message>
```

Send a follow-up message with the card.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| interaction | Interaction | Discord interaction |
| options | object | Optional message options |

**Returns:** Promise\<Message> - The follow-up message

**Example:**

```javascript
await card.followUp(interaction, { ephemeral: true });
```

---

### Rank Card Specific Methods

```typescript
interface RankCardBuilder extends BaseCardBuilder {
  setStats(stats: RankStats): this;
  setProgressColor(color: string): this;
  setRankPosition(position: 'left' | 'right' | 'center'): this;
  showLevelUpAnimation(enabled: boolean): this;
}
```

#### setStats()

```typescript
card.setStats(stats: RankStats): this
```

Set rank statistics.

```typescript
interface RankStats {
  level: number;
  xp: number;
  maxXp: number;
  rank?: number;
  totalXp?: number;
  previousXp?: number;
}
```

**Example:**

```javascript
card.setStats({
  level: 50,
  xp: 7500,
  maxXp: 10000,
  rank: 5,
  totalXp: 150000
});
```

#### setProgressColor()

```typescript
card.setProgressColor(color: string): this
```

Set custom progress bar color.

**Example:**

```javascript
card.setProgressColor('#ff00ff');
```

#### setRankPosition()

```typescript
card.setRankPosition(position: 'left' | 'right' | 'center'): this
```

Set rank badge position.

**Example:**

```javascript
card.setRankPosition('left');
```

---

### Music Card Specific Methods

```typescript
interface MusicCardBuilder extends BaseCardBuilder {
  setTrack(track: TrackInfo): this;
  setProgress(progress: number): this;
  setControls(enabled: boolean): this;
  setVolumeIcon(enabled: boolean): this;
}
```

#### setTrack()

```typescript
card.setTrack(track: TrackInfo): this
```

Set track information.

```typescript
interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  duration: number;         // in seconds
  position: number;         // current position in seconds
}
```

**Example:**

```javascript
card.setTrack({
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  coverUrl: 'https://example.com/cover.jpg',
  duration: 200,
  position: 45
});
```

#### setProgress()

```typescript
card.setProgress(progress: number): this
```

Set playback progress (0-1).

**Example:**

```javascript
card.setProgress(0.225); // 45/200 seconds
```

---

### Leaderboard Card Specific Methods

```typescript
interface LeaderboardCardBuilder extends BaseCardBuilder {
  setEntries(entries: LeaderboardEntry[]): this;
  setHighlightRank(rank: number): this;
  setShowAvatars(show: boolean): this;
  setMaxEntries(max: number): this;
  setColumns(columns: ColumnConfig[]): this;
}
```

#### setEntries()

```typescript
card.setEntries(entries: LeaderboardEntry[]): this
```

Set leaderboard entries.

```typescript
interface LeaderboardEntry {
  rank: number;
  user: Discord.User;
  xp: number;
  level?: number;
  score?: number;
}
```

**Example:**

```javascript
card.setEntries([
  { rank: 1, user: user1, xp: 150000, level: 75 },
  { rank: 2, user: user2, xp: 125000, level: 65 },
  { rank: 3, user: user3, xp: 100000, level: 55 }
]);
```

---

### Invite Card Specific Methods

```typescript
interface InviteCardBuilder extends BaseCardBuilder {
  setInvites(invites: InviteStats): this;
  setHighlightUser(userId: string): this;
  setTimePeriod(period: 'alltime' | 'weekly' | 'monthly'): this;
}
```

#### setInvites()

```typescript
card.setInvites(invites: InviteStats): this
```

Set invite statistics.

```typescript
interface InviteStats {
  total: number;
  regular: number;
  fake: number;
  leaves: number;
  bonus?: number;
}
```

**Example:**

```javascript
card.setInvites({
  total: 50,
  regular: 30,
  fake: 5,
  leaves: 10,
  bonus: 5
});
```

---

### Profile Card Specific Methods

```typescript
interface ProfileCardBuilder extends BaseCardBuilder {
  setInfo(info: ProfileInfo): this;
  setBadges(badges: Badge[]): this;
  setSocial(social: SocialLinks): this;
}
```

#### setInfo()

```typescript
card.setInfo(info: ProfileInfo): this
```

Set profile information.

```typescript
interface ProfileInfo {
  joinDate?: string;
  accountAge?: string;
  badges?: string[];
  title?: string;
  bio?: string;
}
```

---

### Welcome Card Specific Methods

```typescript
interface WelcomeCardBuilder extends BaseCardBuilder {
  setMessage(message: string): this;
  setGuest(guest: boolean): this;
}
```

#### setMessage()

```typescript
card.setMessage(message: string): this
```

Set welcome message.

**Example:**

```javascript
card.setMessage('Welcome to our server, {user}!');
```

---

## Theme System

### themes.register(name, theme)

Register a custom theme.

```typescript
engine.themes.register(name: string, theme: Theme): void
```

**Example:**

```javascript
engine.themes.register('my-theme', {
  name: 'my-theme',
  colors: {
    background: '#1a1a2e',
    primary: '#00ffcc',
    secondary: '#ff00ff',
    accent: '#ffff00',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      muted: '#666666'
    },
    progress: {
      fill: '#00ffcc',
      background: '#333333'
    }
  },
  fonts: {
    title: 'Montserrat Bold',
    body: 'Inter',
    mono: 'JetBrains Mono'
  }
});
```

### themes.get(name)

Get a theme by name.

```typescript
engine.themes.get(name: string): Theme
```

### themes.list()

List all registered themes.

```typescript
engine.themes.list(): string[]
```

---

## Token System

### tokens.set(key, value)

Set a global design token.

```typescript
engine.tokens.set(key: string, value: any): void
```

### tokens.get(key)

Get a global token value.

```typescript
engine.tokens.get(key: string): any
```

### tokens.merge(tokens)

Merge multiple tokens.

```typescript
engine.tokens.merge(tokens: Record<string, any>): void
```

---

## Plugin System

### plugins.register(plugin)

Register a plugin.

```typescript
interface Plugin {
  name: string;
  version?: string;
  register?: (engine: Engine) => void;
  render?: (card: BaseCardBuilder) => void;
}
```

### plugins.get(name)

Get a plugin by name.

```typescript
engine.plugins.get(name: string): Plugin
```

---

## Component Registry

### components.register(name, component)

Register a custom component.

```typescript
engine.components.register(name: string, component: Component): void
```

### components.get(name)

Get a component by name.

```typescript
engine.components.get(name: string): Component
```

---

## Rendering

### toBuffer()

Render the card and return as PNG buffer.

```typescript
card.toBuffer(): Promise<Buffer>
```

### toStream()

Render the card and return as PNG stream.

```typescript
card.toStream(): Promise<Stream>
```

---

## Performance APIs

### cache.clear()

Clear the asset cache.

```typescript
engine.cache.clear(): void
```

### cache.getStats()

Get cache statistics.

```typescript
interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}
```

---

## Types

### Complete Type Definitions

```typescript
// Engine Types
interface Engine {
  createRankCard(): RankCardBuilder;
  createMusicCard(): MusicCardBuilder;
  createLeaderboardCard(): LeaderboardCardBuilder;
  createInviteCard(): InviteCardBuilder;
  createProfileCard(): ProfileCardBuilder;
  createWelcomeCard(): WelcomeCardBuilder;
  themes: ThemeRegistry;
  tokens: TokenRegistry;
  plugins: PluginRegistry;
  components: ComponentRegistry;
  cache: CacheManager;
  fonts: FontManager;
}

// Card Types
interface RankCardBuilder extends BaseCardBuilder {
  setStats(stats: RankStats): this;
  setProgressColor(color: string): this;
  setRankPosition(position: 'left' | 'right' | 'center'): this;
}

interface MusicCardBuilder extends BaseCardBuilder {
  setTrack(track: TrackInfo): this;
  setProgress(progress: number): this;
  setControls(enabled: boolean): this;
}

interface LeaderboardCardBuilder extends BaseCardBuilder {
  setEntries(entries: LeaderboardEntry[]): this;
  setHighlightRank(rank: number): this;
  setShowAvatars(show: boolean): this;
}

interface InviteCardBuilder extends BaseCardBuilder {
  setInvites(invites: InviteStats): this;
  setHighlightUser(userId: string): this;
}

interface ProfileCardBuilder extends BaseCardBuilder {
  setInfo(info: ProfileInfo): this;
  setBadges(badges: Badge[]): this;
}

interface WelcomeCardBuilder extends BaseCardBuilder {
  setMessage(message: string): this;
  setGuest(guest: boolean): this;
}

// Configuration Types
interface EngineOptions {
  dpi?: number;
  cache?: {
    maxSize: number;
    maxAge?: number;
  };
  debug?: boolean;
  canvas?: boolean;
  defaultTheme?: string;
  fonts?: {
    default?: string;
    path?: string;
  };
}

interface CardOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
  background?: string;
  cache?: boolean;
}

interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image';
  value?: string;
  colors?: string[];
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  opacity?: number;
}
```

---

## Related Documentation

- [Getting Started](getting-started.md) - Quick start guide
- [Themes](themes.md) - Theme customization
- [Output Guide](output-guide.md) - Output options
- [Rank Cards](rank-cards.md) - Rank card guide
- [Music Cards](music-cards.md) - Music card guide
- [Leaderboard Cards](leaderboard-cards.md) - Leaderboard guide
- [Invite Cards](invite-cards.md) - Invite card guide

<div align="center">

![Terms](assets/@modularterms.png)

*Complete API reference*

</div>
