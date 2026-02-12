# Getting Started with Modular

## Installation

```bash
npm install modular
```

## Basic Usage

```javascript
const { createEngine } = require('modular');

const engine = createEngine();
```

## Card Creation

```javascript
const rankCard = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

await rankCard.send(interaction);
```

## Discord.js Integration

All cards support:
- `.send(interaction)` - Send as new message
- `.reply(interaction)` - Reply to interaction
- `.followUp(interaction)` - Follow-up message
- `.toBuffer()` - Get PNG buffer
- `.toStream()` - Get PNG stream

## Theme Customization

```javascript
card.useTheme('cyberpunk');
```

Or create custom theme:
```javascript
const customTheme = {
  colors: { background: '#000000', primary: '#ff00ff' },
  fonts: { body: 'Inter' },
  effects: { glow: true }
};
engine.themes.register('custom', customTheme);
```

## Token System

```javascript
engine.tokens.set('card.background', '#1a1a2e');
card.tokens.set('progress.fill', '#ff00ff');
```

## Performance

Modular includes:
- LRU caching for assets
- Font caching
- Gradient caching
- Canvas pooling
- Async asset loading
