# Output Guide

<div align="center">

**Export your cards to Discord, files, or anywhere**

[![Output](https://img.shields.io/npm/dw/modular?style=flat-square&logo=download)](output-guide.md)

</div>

This guide explains how to get output from Modular cards - whether sending to Discord, saving to files, or using in other contexts.

<div align="center">

![Output Guide](assets/@modulardocumentation.png)

*Multiple output options available*

</div>

## Table of Contents

- [Output Methods](#output-methods)
- [Discord Integration](#discord-integration)
- [File Output](#file-output)
- [Stream Output](#stream-output)
- [Buffer Output](#buffer-output)
- [Webhook Support](#webhook-support)
- [Custom Output Handlers](#custom-output-handlers)
- [Best Practices](#best-practices)

---

## Output Methods

Modular provides several ways to output your rendered cards:

| Method | Returns | Use Case |
|--------|---------|----------|
| `send()` | Message | Send directly to Discord |
| `reply()` | Message | Reply to interaction |
| `followUp()` | Message | Follow-up message |
| `toBuffer()` | Buffer | Get PNG buffer |
| `toStream()` | Stream | Get readable stream |

---

## Discord Integration

### Send as New Message

```javascript
// Slash command handler
await interaction.deferReply();

const card = engine.createRankCard()
  .setUser(interaction.user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 })
  .setTheme('cyberpunk');

await card.send(interaction);
```

### Reply to Interaction

```javascript
const card = engine.createProfileCard()
  .setUser(targetUser)
  .setTheme('dark');

await card.reply(interaction);
```

### Follow-up Message

```javascript
// Regular follow-up
await card.followUp(interaction);

// Ephemeral message (only visible to user)
await card.followUp(interaction, { ephemeral: true });
```

### With Files Attachment

```javascript
const { AttachmentBuilder } = require('discord.js');

const buffer = await card.toBuffer();
const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });

await interaction.reply({
  content: 'Here is your rank card:',
  files: [attachment]
});
```

---

## File Output

### Save to File (PNG)

```javascript
const fs = require('fs');
const path = require('path');

const card = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

// Get buffer
const buffer = await card.toBuffer();

// Save to file
const outputPath = path.join(__dirname, 'cards', 'rank-card.png');
fs.writeFileSync(outputPath, buffer);

console.log(`Card saved to ${outputPath}`);
```

### Save Multiple Cards

```javascript
const fs = require('fs');
const path = require('path');

async function generateAllCards(user) {
  const outputDir = path.join(__dirname, 'output');
  fs.mkdirSync(outputDir, { recursive: true });

  const cardTypes = ['rank', 'profile', 'music', 'leaderboard'];

  for (const type of cardTypes) {
    const card = engine.createCard(type)
      .setUser(user)
      .setTheme('cyberpunk');

    const buffer = await card.toBuffer();
    fs.writeFileSync(path.join(outputDir, `${type}-card.png`), buffer);
  }
}
```

### Save as JPEG (with quality)

```javascript
// First get PNG buffer, then convert
const pngBuffer = await card.toBuffer();

// Using canvas directly
const canvas = createCanvas(800, 250);
// ... render card ...
const jpegBuffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
fs.writeFileSync('card.jpg', jpegBuffer);
```

---

## Stream Output

### Get as Readable Stream

```javascript
const { createWriteStream } = require('fs');
const { Stream } = require('stream');

const card = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

// Get stream
const stream = await card.toStream();

// Use in Discord
const { AttachmentBuilder } = require('discord.js');
const attachment = new AttachmentBuilder(stream, { name: 'card.png' });

await interaction.reply({ files: [attachment] });
```

### Save Stream to File

```javascript
const { createWriteStream } = require('fs');

const stream = await card.toStream();
const writer = createWriteStream('card.png');

stream.pipe(writer);

await new Promise((resolve, reject) => {
  writer.on('finish', resolve);
  writer.on('error', reject);
});

console.log('Card saved to file');
```

### Upload to Cloud Storage

```javascript
const { Upload } = require('@google-cloud/storage');

const stream = await card.toStream();
const storage = new Storage();
const bucket = storage.bucket('my-bucket');
const file = bucket.file('cards/rank-card.png');

await file.save(stream, {
  metadata: {
    contentType: 'image/png'
  }
});
```

---

## Buffer Output

### Get as Buffer (PNG)

```javascript
const card = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

// Get PNG buffer
const buffer = await card.toBuffer();

console.log(`Buffer size: ${buffer.length} bytes`);
console.log(`Buffer type: ${buffer.constructor.name}`);

// Buffer contains PNG data
// Use with Discord.js AttachmentBuilder
const { AttachmentBuilder } = require('discord.js');
const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });
```

### Process Buffer

```javascript
const buffer = await card.toBuffer();

// Get base64 for data URLs
const base64 = buffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;

// Use in HTML
// <img src="data:image/png;base64,..." alt="Rank Card" />

// Get hex for debugging
const hex = buffer.toString('hex');
console.log('PNG hex:', hex.substring(0, 100) + '...');
```

### Buffer Utilities

```javascript
const buffer = await card.toBuffer();

// Get buffer info
const info = {
  length: buffer.length,
  toString: () => buffer.toString('base64').substring(0, 50) + '...',
  isPNG: buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a'
};

console.log('Buffer info:', info);

// Copy buffer
const copy = Buffer.alloc(buffer.length);
buffer.copy(copy);

// Slice buffer
const slice = buffer.slice(0, 100);
```

---

## Webhook Support

### Send via Webhook

```javascript
const { WebhookClient } = require('discord.js');

const webhook = new WebhookClient({ id: 'WEBHOOK_ID', token: 'WEBHOOK_TOKEN' });

const card = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

const buffer = await card.toBuffer();

await webhook.send({
  files: [{
    attachment: buffer,
    name: 'rank-card.png'
  }],
  content: 'New rank card!'
});
```

### Webhook with Edit

```javascript
// Get current card as attachment
const buffer = await card.toBuffer();
const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });

// Send initial message
const message = await webhook.send({
  files: [attachment],
  content: 'Level up!'
});

// Update later
const newBuffer = await card.toBuffer();
const newAttachment = new AttachmentBuilder(newBuffer, { name: 'rank-card.png' });

await webhook.editMessage(message.id, {
  files: [newAttachment]
});
```

---

## Custom Output Handlers

### Create Custom Output Function

```javascript
class CardOutputHandler {
  constructor(engine) {
    this.engine = engine;
  }

  async toDiscord(interaction, card) {
    const buffer = await card.toBuffer();
    const { AttachmentBuilder } = require('discord.js');
    const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });
    await interaction.reply({ files: [attachment] });
  }

  async toFile(filePath, card) {
    const fs = require('fs');
    const buffer = await card.toBuffer();
    fs.writeFileSync(filePath, buffer);
  }

  async toBase64(card) {
    const buffer = await card.toBuffer();
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }

  async toBuffer(card) {
    return await card.toBuffer();
  }
}

// Usage
const output = new CardOutputHandler(engine);

await output.toDiscord(interaction, card);
await output.toFile('./output/card.png', card);
const base64 = await output.toBase64(card);
```

### Output with Caching

```javascript
const cache = new Map();

async function getCachedCard(user, stats) {
  const cacheKey = `${user.id}-${stats.level}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const card = engine.createRankCard()
    .setUser(user)
    .setStats(stats);

  const buffer = await card.toBuffer();
  cache.set(cacheKey, buffer);

  return buffer;
}

// Usage
const buffer = await getCachedCard(user, { level: 50 });
```

---

## Best Practices

### 1. Use Async/Await

```javascript
// Good
const buffer = await card.toBuffer();
await interaction.reply({ files: [attachment] });

// Avoid
card.toBuffer().then(buffer => {
  interaction.reply({ files: [attachment] });
});
```

### 2. Handle Errors

```javascript
try {
  const card = engine.createRankCard()
    .setUser(user)
    .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

  await card.send(interaction);
} catch (error) {
  console.error('Failed to generate card:', error);
  await interaction.reply('Failed to generate card. Please try again.');
}
```

### 3. Defer Replies for Slow Rendering

```javascript
// If rendering might take time
await interaction.deferReply();

try {
  const card = engine.createRankCard()
    .setUser(user)
    .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

  await card.send(interaction);
} catch (error) {
  await interaction.followUp('Failed to generate card.');
}
```

### 4. Reuse Buffers When Possible

```javascript
// Cache frequently used cards
const cardCache = new Map();

async function getOrCreateCard(user, theme) {
  const key = `${user.id}-${theme}`;

  if (cardCache.has(key)) {
    return cardCache.get(key);
  }

  const card = engine.createRankCard()
    .setUser(user)
    .setTheme(theme);

  const buffer = await card.toBuffer();
  cardCache.set(key, buffer);

  return buffer;
}
```

### 5. Clean Up Resources

```javascript
// Always release canvas resources
const card = engine.createRankCard()
  .setUser(user)
  .setStats({ level: 50, xp: 7500, maxXp: 10000, rank: 5 });

try {
  const buffer = await card.toBuffer();
  // Use buffer
} finally {
  // Clean up if needed
  engine.cache.clear(); // Periodically
}
```

---

## Related Documentation

- [Getting Started](getting-started.md) - Quick start guide
- [API Reference](api-reference.md) - Complete API documentation
- [Discord.js Integration](getting-started.md#discordjs-integration) - Discord setup
- [Themes](themes.md) - Theme customization

<div align="center">

![Terms](assets/@modularterms.png)

*Output your cards anywhere*

</div>
