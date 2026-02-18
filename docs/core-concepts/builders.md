# Card Builders: The Fluent API

Builders are high-level abstractions that make it easy to create specific types of Discord cards without manual layout configuration.

## 1. RankCardBuilder

Designed specifically for leveling systems. It automatically handles avatar positioning, level badges, and XP bars.

### Key Features:
- **Automatic Truncation**: Usernames are clipped to fit.
- **Progress Logic**: Pass `xp` and `maxXp`, and the builder calculates the percentage.
- **Theme Awareness**: Knows how to render the circular ring for `neon-tech`.

```javascript
engine.createRankCard()
    .setUsername('EpicGamer')
    .setStats({ level: 15, xp: 800, maxXp: 1200 })
    .render();
```

## 2. MusicCardBuilder

Optimized for "Now Playing" cards in music bots.

### Key Features:
- **Elapsed Time**: Visual progress bar for song duration.
- **Album Art**: Renders the large background or a small square depending on theme.
- **Status Icons**: Shows "Playing" or "Paused" indicators.

```javascript
engine.createMusicCard()
    .setTrack({
        title: 'Cyberpunk Skyline',
        artist: 'SynthWave Dave',
        albumArt: '...',
        duration: 340,
        currentTime: 120
    })
    .render();
```

## 3. ProfileCardBuilder

A generic card for displaying user bios, join dates, and server info.

### Key Features:
- **Banner Support**: Full-width top banner rendering.
- **Bio Truncation**: Multi-line text wrapping and ellipsis.
- **Status Indicators**: Shows online/idle/dnd status rings.

## 4. LeaderboardCardBuilder

Handles rendering lists of users in a single, vertical card.

### Key Features:
- **Dynamic Rows**: Renders multiple user entries automatically.
- **Rank Numbers**: Bold indicators for 1st, 2nd, and 3rd place.

## Why Builders don't contain Styling

A common question is why `RankCardBuilder` doesn't have a `.setColor()` method inside the stat setter. 
**The Separation of Concerns Principle**:
The builder's job is to define the **content**. The Theme's job is to define the **look**. By keeping them separate, you can switch themes and the builder will automatically re-map its data to the new theme's visual language.

---

Next: [Design System: Asset Mapping](../design-system/assets-mapping.md)
