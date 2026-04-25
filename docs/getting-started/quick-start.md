# Quick Start Guide

[← Back: Installation](./installation.md) | [Next: First Card In-Depth →](./first-card.md)

---

Get your first Discord card rendered in less than 2 minutes. This guide covers the absolute essentials of using the `@reformlabs/modular` engine.

![Installation Banner](../assets/@modularinstallation.png)

## 1. The Core Workflow

The typical lifecycle of creating a card follows four simple steps:
1. **Initialize** a builder.
2. **Setup** the data (username, avatar, stats).
3. **Style** the card using a theme.
4. **Export** the result to a buffer.

## 2. Your First Rank Card

```javascript
import { RankCard } from '@reformlabs/modular';
import fs from 'fs';

async function generateRank() {
    // 1. Build & Style
    const card = new RankCard()
        .setUsername('Alex Smith')
        .setAvatar('https://github.com/manymq.png')
        .setStats({ level: 42, rank: 7, xp: 2500, maxXp: 5000 })
        .setTheme('neon-tech');

    // 2. Render to Buffer
    const buffer = await card.render();

    // 3. Save locally
    fs.writeFileSync('rank-card.png', buffer);
    console.log('✓ Success! Check rank-card.png');
}

generateRank().catch(console.error);
```

## 3. Changing Themes Instantly

The engine is designed to handle visual transformations without any code changes to your data logic. Try replacing `.setTheme('neon-tech')` with:

- `glass-modern`: A clean, translucent aesthetic.
- `pink-gradient`: Soft, vibrant colors with smooth transitions.
- `esport`: Aggressive, high-contrast design for gamers.
- `minimal-developer`: Dark, coding-inspired monochrome layout.
- `cyberpunk`: High-energy neon yellow and dark backgrounds.

## 4. Export Formats

By default, `.render()` produces a high-quality PNG. You can customize the output via the options object:

```javascript
const buffer = await card.render({
    format: 'webp', // 'png' (default), 'jpeg', 'webp'
    quality: 0.9    // Only for jpeg/webp (0.0 to 1.0)
});
```

## 5. Usage in Discord Bots (discord.js)

The library includes built-in helpers for `discord.js` interactions, making integration seamless. The `.reply()` and `.send()` methods automatically handle rendering and attaching the buffer.

```javascript
// Inside a slash command handler:
await new RankCard()
    .setUser(interaction.user)
    .setStats({ level: 15, xp: 4200, maxXp: 5000 })
    .setTheme('glass-modern')
    .reply(interaction); // One-liner! Renders and replies to the interaction.
```

---

[← Back: Installation](./installation.md) | [Next: First Card In-Depth →](./first-card.md)
