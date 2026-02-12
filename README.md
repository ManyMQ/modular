# Modular

**Production-grade Node.js canvas rendering engine for Discord cards**

<div align="center">

[![npm version](https://img.shields.io/npm/v/modular.svg)](https://www.npmjs.com/package/modular)
[![node](https://img.shields.io/node/v/modular.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/modular.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 🚀 Quick Start

```bash
npm install modular
```

```javascript
const { createEngine } = require('modular');

const engine = createEngine();
const card = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

await card.send(interaction);
```

---

## 🎮 Card Types

| Card Type | Method | Description |
|-----------|--------|-------------|
| Rank | `engine.createRankCard()` | Level/XP progress cards |
| Music | `engine.createMusicCard()` | Music player displays |
| Leaderboard | `engine.createLeaderboardCard()` | Server rankings |
| Invite | `engine.createInviteCard()` | Invite tracking |
| Profile | `engine.createProfileCard()` | User profiles |
| Welcome | `engine.createWelcomeCard()` | Welcome messages |

---

## 🎨 Themes

Built-in themes ready to use:

- `cyberpunk` - Neon cyberpunk aesthetic
- `neon` - Glowing neon effects
- `dark` - Clean dark theme
- `midnight` - Deep midnight blue

```javascript
card.useTheme('cyberpunk');
```

---

## 🧬 Token System

Override design tokens globally or per card:

```javascript
engine.tokens.set('card.background', '#1a1a2e');
engine.tokens.set('text.primary', '#00ffcc');
card.tokens.set('progress.fill', '#ff00ff');
```

---

## 🧩 Component Override

Replace any renderer component:

```javascript
engine.components.register('avatar', CustomAvatarComponent);
```

---

## ⚡ Render Pipeline

```
Layout Resolve → Token Resolve → Theme Resolve → Asset Load
     ↓              ↓               ↓              ↓
Pre Render Hook → Component Render Pass → FX Pass → Post Render Hook
     ↓                              ↓              ↓
                                      Encode Output
```

---

## 🔌 Plugin System

```javascript
const plugin = new BasePlugin('my-plugin');
plugin.register('onPreRender', (ctx) => { /* ... */ });
engine.plugins.register(plugin);
```

---

## 📦 API Reference

### Engine

```javascript
const engine = createEngine({
  dpi: 2,
  cache: { maxSize: 100 },
  debug: false
});
```

### Card Builders

All builders support:

```javascript
card.setUser(discordUser)
    .setGuild(discordGuild)
    .setTheme('name')
    .setTokens({ key: value })
    .send(interaction)
    .reply(interaction)
    .followUp(interaction)
    .toBuffer()
    .toStream();
```

---

## 🧹 Performance

Modular includes:
- Font caching
- Image caching
- Gradient caching
- Canvas pooling
- Async asset loading
- Batch rendering support

---

## 📄 License

MIT
