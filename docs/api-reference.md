# API Reference

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
  setShowAvatars(enabled: boolean): this;
  setMaxEntries(max: number): this;
  setColumns(columns: LeaderboardColumn[]): this;
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
  custom?: Record<string, any>;
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

#### setHighlightRank()

```typescript
card.setHighlightRank(rank: number): this
```

Highlight a specific rank.

**Example:**

```javascript
card.setHighlightRank(interaction.user.id);
```

---

### Invite Card Specific Methods

```typescript
interface InviteCardBuilder extends BaseCardBuilder {
  setInvites(invites: InviteStats): this;
  setInviter(inviter?: Discord.User): this;
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
  bonus: number;
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
  description?: string;
  location?: string;
  occupation?: string;
}
```

---

### Welcome Card Specific Methods

```typescript
interface WelcomeCardBuilder extends BaseCardBuilder {
  setMessage(message: string): this;
  setMemberCount(count: number): this;
  setLeaveAnimation(enabled: boolean): this;
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

### Registering a Theme

```typescript
engine.themes.register(name: string, theme: Theme): void
```

**Example:**

```javascript
const myTheme = {
  name: 'my-theme',
  version: '1.0.0',
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
  },
  effects: {
    glow: true,
    shadow: true,
    gradient: true
  },
  borderRadius: 16,
  padding: 20
};

engine.themes.register('custom', myTheme);
```

### Getting a Theme

```typescript
engine.themes.get(name: string): Theme
```

### Applying a Theme

```typescript
engine.themes.apply(name: string): void
```

### Listing Themes

```typescript
engine.themes.list(): string[]
```

---

## Token System

### Setting Tokens

```typescript
engine.tokens.set(key: string, value: any): void
card.tokens.set(key: string, value: any): void
```

### Getting Tokens

```typescript
engine.tokens.get(key: string): any
card.tokens.get(key: string): any
```

### Merging Tokens

```typescript
engine.tokens.merge(tokens: Record<string, any>): void
card.tokens.merge(tokens: Record<string, any>): void
```

### Deleting Tokens

```typescript
engine.tokens.delete(key: string): void
card.tokens.delete(key: string): void
```

---

## Plugin System

### Creating a Plugin

```typescript
class MyPlugin extends BasePlugin {
  constructor() {
    super('my-plugin', '1.0.0');
  }

  onInit() {
    // Called when plugin is registered
  }

  onPreRender(context: RenderContext) {
    // Called before rendering
  }

  onPostRender(buffer: Buffer) {
    // Called after rendering
    return buffer;
  }

  onError(error: Error) {
    // Called when an error occurs
  }
}
```

### Registering a Plugin

```typescript
engine.plugins.register(plugin: Plugin): void
```

### Plugin Hooks Reference

| Hook | Parameters | Description |
|------|------------|-------------|
| `onInit` | - | Called when plugin is registered |
| `onPreRender` | RenderContext | Called before rendering |
| `onPostRender` | Buffer | Called after rendering |
| `onThemeApplied` | Theme | Called when theme is applied |
| `onCardSend` | Interaction | Called before sending |
| `onError` | Error | Called on error |

---

## Component Registry

### Registering a Component

```typescript
engine.components.register(name: string, component: Component): void
```

### Getting a Component

```typescript
engine.components.get(name: string): Component
```

### Overriding a Component

```typescript
engine.components.override(name: string, component: Component): void
```

---

## Rendering

### Synchronous Render

```typescript
card.render(): Promise<Buffer>
```

### Async Render

```typescript
card.renderAsync(): Promise<Buffer>
```

### Low-level Rendering

```typescript
engine.render(card): Promise<Buffer>
```

---

## Performance APIs

### Cache Operations

```typescript
// Clear cache
engine.cache.clear();

// Get cache statistics
const stats = engine.cache.getStats();
// Returns: { size: number, hits: number, misses: number }
```

### Pool Operations

```typescript
// Acquire canvas from pool
const canvas = await engine.pool.acquire();

// Release canvas back to pool
engine.pool.release(canvas);
```

### Render Statistics

```typescript
const stats = engine.getRenderStats();
// Returns: { renderTime: number, cacheHits: number, assetsLoaded: number }
```

---

## Types

### Discord Types

```typescript
interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  displayAvatarURL(): string;
}

interface DiscordGuild {
  id: string;
  name: string;
  iconURL(): string | null;
}

interface DiscordInteraction {
  user: DiscordUser;
  guild: DiscordGuild | null;
  reply(options: object): Promise<void>;
  followUp(options: object): Promise<void>;
}
```

### Render Types

```typescript
interface RenderContext {
  card: CardBuilder;
  theme: Theme;
  tokens: TokenStore;
  canvas: Canvas;
  width: number;
  height: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}
```

---

## Error Handling

```typescript
try {
  const card = engine.createRankCard()
    .setUser(user)
    .setStats({ /* stats */ });
  await card.send(interaction);
} catch (error) {
  if (error instanceof RenderError) {
    console.error('Rendering failed:', error.message);
  } else if (error instanceof AssetLoadError) {
    console.error('Failed to load asset:', error.url);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## Changelog

See [CHANGELOG.md](../CHANGELOG.md) for version history.

## Related Documentation

- [Getting Started](getting-started.md)
- [Themes](themes.md)
- [Plugins](plugins.md)
- [Performance](api-reference.md#performance-apis)
