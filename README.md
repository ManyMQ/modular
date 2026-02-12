# <div align="center"><img src="docs/assets/modularlight_banner_transparent.png" alt="Modular" width="400"/></div>

<div align="center">

**A powerful, flexible, and themeable card generation library for Discord bots**

[![Discord Server](https://img.shields.io/discord/1234567890?style=flat-square&logo=discord&label=Discord)](https://discord.gg/dxFKm7nhCN)
[![npm version](https://img.shields.io/npm/v/@modulardark/example?style=flat-square&logo=npm)](https://npmjs.com/package/modular)
[![npm downloads](https://img.shields.io/npm/dw/modular?style=flat-square&logo=npm)](https://npmjs.com/package/modular)
[![License](https://img.shields.io/github/license/example/modular?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/example/modular?style=flat-square)](https://github.com/example/modular/stargazers)

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🎨 Themes](#-themes)
- [💻 Examples](#-examples)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🎨 **Themeable** | Multiple built-in themes with full customization |
| 🃏 **Card Types** | Profile, Rank, Level, Welcome, Leaderboard, Music, and more |
| ⚡ **Fast & Lightweight** | Optimized rendering pipeline |
| 🔌 **Plugin System** | Extend functionality with plugins |
| 🎯 **TypeScript Ready** | Full type definitions included |
| 🌙 **Dark/Light Modes** | Automatic theme detection |

</div>

---

## 🚀 Quick Start

### Installation

```bash
# npm
npm install modular

# yarn
yarn add modular

# pnpm
pnpm add modular
```

### Basic Usage

```javascript
const { createEngine } = require('modular');
const engine = createEngine();

// Create a profile card
const card = engine.createProfileCard()
  .setUser(user)
  .setBackground('https://example.com/bg.jpg')
  .setTheme('dark');

await card.send(interaction);
```

### From Setup to Send

```javascript
const { createEngine } = require('modular');
const engine = createEngine({
  defaultTheme: 'neon',
  cache: {
    enabled: true,
    maxSize: 500
  }
});

// Create and send a rank card
const rankCard = engine.createRankCard()
  .setUser(interaction.user)
  .setXP({ current: 7500, next: 10000, percentage: 75 })
  .setLevel(15)
  .setRank(42);

await rankCard.send(interaction);
```

---

## 📖 Documentation

<div align="center">

| Section | Description |
|---------|-------------|
| [Getting Started](docs/getting-started.md) | Installation, setup, and basic usage |
| [API Reference](docs/api-reference.md) | Complete API documentation |
| [Themes](docs/themes.md) | Theme customization guide |
| [Output Guide](docs/output-guide.md) | Export and deployment options |

</div>

---

## 🎨 Themes

Modular comes with multiple stunning themes out of the box:

<div align="center">

| Theme | Preview |
|-------|---------|
| 🌙 **Dark** | Classic dark theme |
| ✨ **Neon** | Cyberpunk neon aesthetics |
| 🌊 **Ocean** | Blue ocean vibes |
| 🌸 **Sakura** | Cherry blossom theme |
| 🔥 **Fire** | Fiery red theme |
| 💜 **Midnight** | Deep purple midnight |

</div>

### Using Themes

```javascript
// Built-in themes
card.setTheme('neon');

// Custom theme
card.setTheme({
  name: 'custom',
  background: '#1a1a2e',
  primary: '#00ffcc',
  secondary: '#ff00ff'
});
```

---

## 💻 Examples

### Profile Card

```javascript
const card = engine.createProfileCard()
  .setUser(user)
  .setAvatar(user.displayAvatarURL({ size: 256 }))
  .setUsername(user.username)
  .setDiscriminator(user.discriminator)
  .setBackground('https://example.com/bg.jpg')
  .setTheme('neon')
  .setStats({
    level: 25,
    xp: 12500,
    rank: 150
  });

await card.send(interaction);
```

### Rank Card

```javascript
const rankCard = engine.createRankCard()
  .setUser(interaction.user)
  .setLevel(42)
  .setRank(5)
  .setXP({ current: 8500, next: 10000, percentage: 85 })
  .setTheme('dark')
  .addBadge({ type: 'online', position: 'top-right' });

await rankCard.send(interaction);
```

### Leaderboard Card

```javascript
const leaderboard = engine.createLeaderboardCard()
  .setGuild(interaction.guild)
  .setEntries(topUsers.map((user, i) => ({
    rank: i + 1,
    user: user,
    xp: user.xp,
    level: user.level
  })))
  .setTheme('midnight');

await leaderboard.send(interaction);
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Modular Team**

[![Follow on GitHub](https://img.shields.io/github/followers/example?style=flat-square&logo=github)](https://github.com/example)
[![Follow on Twitter](https://img.shields.io/twitter/follow/example?style=flat-square&logo=twitter)](https://twitter.com/example)

</div>
