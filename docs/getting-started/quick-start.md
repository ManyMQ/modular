# Quick Start

Get your first Discord card rendered in less than 2 minutes. This guide covers the absolute essentials of using the Modular engine.

![Installation Banner](../assets/@modularinstallation.png)

## 1. The Core Workflow

The typical lifecycle of creating a card follows four simple steps:
1. **Initialize** the engine.
2. **Setup** the builder with user data.
3. **Style** the card using a theme.
4. **Export** the result to a buffer or file.

## 2. Your First Rank Card

```javascript
import { RankCard } from '@osn/modular';
import fs from 'fs';

async function generateRank() {
    // 1. Build & Style (standalone constructor)
    const card = new RankCard()
        .setUsername('Alex Smith')
        .setAvatar('https://github.com/manymq.png')
        .setLevel(42)
        .setRank(7)
        .setXP(2500, 5000);

    // 2. Set Theme
    card.setTheme('neon-tech');

    // 3. Render to Buffer
    const buffer = await card.render();

    // 4. Save locally
    fs.writeFileSync('rank-card.png', buffer);
    console.log('✓ Success! Check rank-card.png');
}

generateRank().catch(console.error);
```

## 3. Changing Themes Instantly

The engine is designed to handle visual transformations without code changes to your data logic. Try replacing `.setTheme('neon-tech')` with:

- `glass-modern`: A clean, translucent aesthetic.
- `pink-gradient`: Soft, vibrant colors with smooth transitions.
- `esport`: Aggressive, high-contrast design for gamers.
- `minimal-developer`: Dark, coding-inspired layout.

## 4. Export Formats

By default, `.render()` produces a high-quality PNG. You can customize the output via the options object:

```javascript
const buffer = await card.render({
    format: 'webp', // 'png' (default), 'jpeg', 'webp'
    quality: 0.8    // Only for jpeg/webp (0.0 to 1.0)
});
```

## 5. Usage in Discord Bots (discord.js)

The library includes built-in helpers for `discord.js` interactions, making integration seamless.

```javascript
// Inside a command handler
await engine.createRankCard()
    .setUser(interaction.user)
    .setStats(dbUserStats)
    .setTheme('glass-modern')
    .reply(interaction); // One-liner for Discord.js!
```

---

Next: [Your First Card](./first-card.md)
