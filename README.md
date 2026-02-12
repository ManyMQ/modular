# Modular

<div align="center">

![Modular Banner](docs/assets/@modularbanner.png)

**Production-grade Node.js canvas rendering engine for Discord cards**

[![npm version](https://img.shields.io/npm/v/modular.svg)](https://www.npmjs.com/package/modular)
[![node](https://img.shields.io/node/v/modular.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/modular.svg)](https://opensource.org/licenses/MIT)
[![discord](https://img.shields.io/discord/1234567890)](https://discord.gg/example)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🎮 Card Types](#-card-types)
- [🎨 Themes](#-themes)
- [🧬 Token System](#-token-system)
- [🔧 Architecture](#-architecture)
- [📦 API Reference](#-api-reference)
- [🧩 Plugin System](#-plugin-system)
- [⚡ Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

Modular is a powerful, flexible canvas rendering engine designed specifically for Discord bots. Here's what makes it special:

### Core Features

- 🎨 **Multiple Card Types** - Rank, Profile, Music, Leaderboard, Invite, and Welcome cards out of the box
- 🎯 **Theme System** - Built-in themes and custom theme support with full customization
- 🧬 **Token System** - Design tokens for global and per-card styling overrides
- 🔌 **Plugin Architecture** - Extend functionality with custom plugins and hooks
- ⚡ **High Performance** - Optimized rendering pipeline with caching and pooling
- 📐 **Component System** - Modular, replaceable components for any rendering need
- 🎭 **Effects Engine** - Built-in support for gradients, shadows, glows, and animations

### Technical Highlights

- Written in modern JavaScript (ES2022+)
- Native Node.js canvas rendering via `@napi-rs/canvas`
- TypeScript definitions included for better IDE support
- Promise-based async API
- Battle-tested in production environments

---

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install modular

# Using yarn
yarn add modular

# Using pnpm
pnpm add modular
```

### Basic Usage

```javascript
const { createEngine } = require('modular');

// Create engine instance
const engine = createEngine({
  dpi: 2,
  cache: { maxSize: 100 },
  debug: false
});

// Create a rank card
const rankCard = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

// Send to Discord
await rankCard.send(interaction);
```

### Discord.js Integration

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const { createEngine } = require('modular');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const engine = createEngine();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rank') {
    const rankCard = engine.createRankCard()
      .setUser(interaction.user)
      .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

    await rankCard.send(interaction);
  }
});

client.login('YOUR_TOKEN');
```

---

## 📖 Documentation

For full documentation, visit our [Documentation Portal](docs/getting-started.md).

### Getting Started

New to Modular? Start with our [Getting Started Guide](docs/getting-started.md) to learn the basics.

### Guides & Tutorials

- [Installation Guide](docs/getting-started.md#installation)
- [Creating Your First Card](docs/getting-started.md#card-creation)
- [Theme Customization](docs/themes.md)
- [Plugin Development](docs/plugins.md)

### API Reference

- [Core API](docs/api-reference.md)
- [Card Builders](docs/api-reference.md#card-builder-methods)
- [Theme System](docs/api-reference.md#theme-system)
- [Token System](docs/api-reference.md#token-system)
- [Plugin System](docs/api-reference.md#plugin-system)

---

## 🎮 Card Types

Modular supports a variety of card types for different Discord bot use cases:

| Card Type | Method | Description |
|-----------|--------|-------------|
| **Rank** | `engine.createRankCard()` | Level/XP progress cards with rank display |
| **Music** | `engine.createMusicCard()` | Music player displays with progress bar |
| **Leaderboard** | `engine.createLeaderboardCard()` | Server rankings and leaderboards |
| **Invite** | `engine.createInviteCard()` | Invite tracking and statistics |
| **Profile** | `engine.createProfileCard()` | User profile cards |
| **Welcome** | `engine.createWelcomeCard()` | Welcome messages for new members |

### Example: Rank Card

```javascript
const rankCard = engine.createRankCard()
  .setUser(user)
  .setGuild(guild)
  .setTheme('cyberpunk')
  .setStats({
    level: 50,
    xp: 7500,
    maxXp: 10000,
    rank: 5,
    totalXp: 150000
  })
  .setBackground({
    type: 'gradient',
    colors: ['#1a1a2e', '#16213e']
  });

await rankCard.send(interaction);
```

### Example: Music Card

```javascript
const musicCard = engine.createMusicCard()
  .setUser(user)
  .setTrack({
    title: 'Favorite Song',
    artist: 'Best Artist',
    album: 'Great Album',
    coverUrl: 'https://example.com/cover.jpg',
    duration: 180,
    position: 45
  })
  .setTheme('neon');

await musicCard.send(interaction);
```

---

## 🎨 Themes

Modular comes with several built-in themes ready to use:

### Built-in Themes

| Theme | Description |
|-------|-------------|
| `cyberpunk` | Neon cyberpunk aesthetic with glowing effects |
| `neon` | Vibrant neon glow effects |
| `dark` | Clean, modern dark theme |
| `midnight` | Deep midnight blue gradient |
| `light` | Minimalist light theme |
| `ocean` | Ocean blue gradient theme |
| `sunset` | Warm sunset gradient theme |

### Using Themes

```javascript
// Apply a built-in theme
card.useTheme('cyberpunk');

// Apply a custom theme
const myTheme = {
  name: 'my-custom-theme',
  colors: {
    background: '#1a1a2e',
    primary: '#00ffcc',
    secondary: '#ff00ff',
    accent: '#ffff00'
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
  }
};

engine.themes.register('custom', myTheme);
card.useTheme('custom');
```

### Theme Structure

```typescript
interface Theme {
  name: string;
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    progress: {
      fill: string;
      background: string;
    };
  };
  fonts: {
    title: string;
    body: string;
    mono: string;
  };
  effects?: {
    glow?: boolean;
    shadow?: boolean;
    gradient?: boolean;
    blur?: boolean;
  };
  borderRadius?: number;
  padding?: number;
}
```

---

## 🧬 Token System

Modular uses a design token system for granular control over styling. Tokens can be set globally on the engine or per-card.

### Global Tokens

```javascript
// Set tokens globally
engine.tokens.set('card.background', '#1a1a2e');
engine.tokens.set('text.primary', '#00ffcc');
engine.tokens.set('text.fontFamily', 'Inter');
engine.tokens.set('progress.fill', '#ff00ff');
engine.tokens.set('avatar.border', '#00ffcc');
engine.tokens.set('card.borderRadius', 16);
```

### Per-Card Tokens

```javascript
// Override tokens for specific cards
card.tokens.set('card.background', '#0a0a0a');
card.tokens.set('text.primary', '#ff00ff');
card.tokens.set('progress.fill', '#ff00ff');
```

### Available Tokens

```typescript
// Card tokens
'card.width'              // Card width (default: 800)
'card.height'             // Card height (default: 250)
'card.background'         // Background color
'card.gradient'            // Gradient configuration
'card.border'             // Border style
'card.borderRadius'       // Border radius
'card.shadow'              // Shadow effect
'card.padding'             // Padding

// Text tokens
'text.primary'            // Primary text color
'text.secondary'          // Secondary text color
'text.muted'              // Muted text color
'text.fontFamily'         // Font family
'text.fontSize'           // Font size
'text.fontWeight'         // Font weight
'text.align'              // Text alignment

// Progress tokens
'progress.fill'           // Progress bar fill color
'progress.background'     // Progress bar background
'progress.height'         // Progress bar height
'progress.borderRadius'   // Progress bar radius

// Avatar tokens
'avatar.size'             // Avatar size
'avatar.border'           // Avatar border color
'avatar.borderWidth'      // Avatar border width
'avatar.shape'            // Avatar shape (circle, square, rounded)
```

---

## 🔧 Architecture

Modular is built with a modular architecture in mind, consisting of several core components:

```
Modular Architecture
├── 🎨 Render Engine
│   ├── 📐 Layout Parser
│   ├── 🎭 Theme Resolver
│   ├── 🧬 Token Engine
│   └── 🎨 Style Engine
├── 🧩 Component System
│   ├── BaseComponent
│   ├── UI Components
│   │   ├── TextComponent
│   │   ├── AvatarComponent
│   │   ├── ContainerComponent
│   │   ├── ProgressComponent
│   │   └── MediaComponent
│   └── Card Components
│       └── CardRenderer
├── 🔌 Plugin System
│   ├── PluginManager
│   └── Plugin Lifecycle Hooks
├── 📦 Asset System
│   ├── AssetLoader
│   ├── AssetCache
│   └── FontManager
└── ⚡ Performance Layer
    ├── CanvasRenderer
    ├── BufferManager
    └── LRUCache
```

### Render Pipeline

```
┌─────────────────┐
│ Layout Resolve  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Token Resolve   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Theme Resolve   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Asset Loading   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Pre Render Hook │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Component Render│
└────────┬────────┘
         ▼
┌─────────────────┐
│ FX Pass         │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Post Render Hook│
└────────┬────────┘
         ▼
┌─────────────────┐
│ Encode Output   │
└─────────────────┘
```

---

## 📦 API Reference

### createEngine(options)

Create a new engine instance with optional configuration.

```typescript
function createEngine(options?: EngineOptions): Engine

interface EngineOptions {
  dpi?: number;              // Render DPI (default: 2)
  cache?: { maxSize: number };  // Cache max size (default: 100)
  debug?: boolean;           // Debug mode (default: false)
  canvas?: boolean;          // Enable canvas (default: true)
}
```

### Engine Methods

| Method | Description |
|--------|-------------|
| `createRankCard()` | Create a new rank card builder |
| `createMusicCard()` | Create a new music card builder |
| `createLeaderboardCard()` | Create a new leaderboard builder |
| `createInviteCard()` | Create a new invite tracker builder |
| `createProfileCard()` | Create a new profile card builder |
| `createWelcomeCard()` | Create a new welcome card builder |
| `themes.register(name, theme)` | Register a custom theme |
| `tokens.set(key, value)` | Set a design token |
| `plugins.register(plugin)` | Register a plugin |
| `components.register(name, component)` | Register a component |

### CardBuilder Methods

All card builders support these methods:

```typescript
// User & Guild
card.setUser(user: Discord.User)
card.setGuild(guild: Discord.Guild)

// Styling
card.setTheme(name: string)
card.setTokens(tokens: Record<string, any>)
card.setBackground(config: BackgroundConfig)

// Rendering
card.toBuffer(): Promise<Buffer>
card.toStream(): Promise<Stream>
card.render(): Promise<Buffer>

// Discord Integration
card.send(interaction): Promise<Message>
card.reply(interaction): Promise<Message>
card.followUp(interaction): Promise<Message>
```

### Rank Card Specific Methods

```typescript
card.setStats({
  level: number,
  xp: number,
  maxXp: number,
  rank: number,
  totalXp?: number
})
```

### Music Card Specific Methods

```typescript
card.setTrack({
  title: string,
  artist: string,
  album?: string,
  coverUrl?: string,
  duration: number,
  position: number
})
```

---

## 🧩 Plugin System

Modular's plugin system allows you to extend functionality with custom hooks and features.

### Creating a Plugin

```javascript
const { BasePlugin } = require('modular');

class MyPlugin extends BasePlugin {
  constructor() {
    super('my-plugin', '1.0.0');
  }

  onPreRender(context) {
    // Add custom pre-render logic
    console.log('Pre-render hook:', context.card);
  }

  onPostRender(buffer) {
    // Modify the rendered output
    return buffer;
  }

  onThemeApplied(theme) {
    // Respond to theme changes
  }
}

// Register the plugin
engine.plugins.register(new MyPlugin());
```

### Plugin Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `onInit` | Called when plugin is registered |
| `onPreRender` | Called before rendering begins |
| `onPostRender` | Called after rendering completes |
| `onThemeApplied` | Called when a theme is applied |
| `onCardSend` | Called before card is sent to Discord |
| `onError` | Called when an error occurs |

---

## ⚡ Performance

Modular includes several performance optimizations:

### Caching

- **Asset Caching** - Images and fonts are cached to avoid reloading
- **Gradient Caching** - Pre-rendered gradients for reuse
- **LRU Cache** - Least Recently Used cache for memory management

### Rendering Optimizations

- **Canvas Pooling** - Reuse canvas instances to reduce GC pressure
- **Async Asset Loading** - Load assets in parallel
- **Batch Rendering** - Render multiple elements in a single pass
- **DPI Scaling** - Configurable DPI for quality vs. performance

### Performance Monitoring

```javascript
// Get cache statistics
const cacheStats = engine.cache.getStats();

// Get render statistics
const renderStats = engine.getRenderStats();

// Clear cache
engine.cache.clear();
```

### Performance Tips

1. **Reuse Engine Instance** - Create one engine instance per bot
2. **Batch Card Rendering** - Use async/await for parallel rendering
3. **Optimize Images** - Use optimized, compressed images
4. **Configure DPI** - Lower DPI for better performance
5. **Monitor Memory** - Use cache.clear() periodically

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/modular/modular.git
cd modular

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Building

```bash
# Build for production
npm run build

# Build TypeScript definitions
npm run build:types
```

---

## 📄 License

Modular is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Modular Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by the Modular Team**

[Website](https://modular.js.org) • [Documentation](docs/getting-started.md) • [Discord](https://discord.gg/example) • [GitHub](https://github.com/modular/modular)

</div>
