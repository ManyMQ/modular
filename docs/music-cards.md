# Music Cards

Create music player display cards for Discord bots.

## Basic Usage

```javascript
const { createEngine } = require('modul');

const engine = createEngine();

const musicCard = engine.createMusicCard()
  .setTrack({
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    duration: 212, // seconds
    artwork: 'https://example.com/artwork.jpg',
    url: 'https://example.com/track'
  })
  .setPlayer({
    state: 'playing', // playing, paused, stopped
    position: 45, // current position in seconds
    volume: 75,
    shuffle: false,
    repeat: 'off' // off, track, queue
  })
  .setRequester(interaction.user)
  .setTheme('cyberpunk');

await musicCard.reply(interaction);
```

## API

### setTrack(track)

Set track information.

```typescript
interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  duration: number; // seconds
  artwork?: string;
  url?: string;
}
card.setTrack(track: TrackInfo)
```

### setPlayer(player)

Set player state.

```typescript
interface PlayerState {
  state: 'playing' | 'paused' | 'stopped';
  position: number; // seconds
  volume: number; // 0-100
  shuffle: boolean;
  repeat: 'off' | 'track' | 'queue';
}
card.setPlayer(player: PlayerState)
```

### setRequester(user)

Set the user who requested the track.

```typescript
card.setRequester(user: Discord.User)
```

### setTheme(name)

Apply a theme.

```typescript
card.setTheme(name: string)
```

## Output Methods

| Method | Description |
|--------|-------------|
| `await card.reply(interaction)` | Reply to slash command |
| `await card.followUp(interaction)` | Follow-up message |
| `await card.toBuffer()` | Get PNG buffer |
| `await card.toStream()` | Get PNG stream |
