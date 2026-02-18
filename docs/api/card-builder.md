# API Reference: CardBuilder

The `CardBuilder` is the primary interface for most developers. It uses a **fluent API pattern** (method chaining) to keep your code clean and readable.

## Base Class: `CardBuilder`

### Global Configuration Methods

#### `.setTheme(themeName)`
Registers a theme for the current card.
- **Param**: `themeName` (string) - Must match a registered theme ID.
- **Default**: `discord`

#### `.setSize(width, height)`
Overrides the default dimensions of the card.
- **Params**: `width` (number), `height` (number)
- **Constraint**: Values must be between 1 and 4096 pixels.

#### `.setDpi(dpi)`
Overrides the global engine DPI for this specific card.
- **Param**: `dpi` (number) - Higher values (2, 3) produce sharper images but take slightly longer to render.

### Styling & Customization

#### `.setToken(name, value)`
Overrides a single design token on this card.
- **Example**: `.setToken('accent.primary', '#00ff00')`

#### `.setColors(colorMap)`
Batch override of surface and accent colors.
- **Param**: `colorMap` (Object) - `{ surface: { primary: '#000' } }`

#### `.setBackground({ color, gradient, image })`
A shortcut for setting complex background fill logic.

### Exporting

#### `.render(options)`
The final method needed to produce an image.
- **Options**: `{ format: 'png' | 'jpeg' | 'webp', quality: number }`
- **Returns**: `Promise<Buffer>`

#### `.toBuffer()`
Alias for `.render()`.

## Specialized Class: `RankCardBuilder`

Includes methods specific to gaming and leveling statistics.

#### `.setUser(userObject)`
A utility that extracts username, discriminator, and avatar from a `discord.js` User object.

#### `.setStats({ level, rank, xp, maxXp, score })`
Sets the numeric indicators and computes the progress bar fill.

#### `.setRankLabel(label)`
Customize the "RANK" text (e.g., to "TOP").

## Specialized Class: `MusicCardBuilder`

#### `.setTrack({ title, artist, albumArt, duration, currentTime, isPlaying })`
Sets all music-related metadata. `duration` and `currentTime` are used for the progress bar.

#### `.setControlStatus(status)`
Visual indicator for play/pause/stop.

---

Next: [Theme Engine API](./theme-engine.md)
