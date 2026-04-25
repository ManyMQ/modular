# Your First Card: In-Depth

Now that you've run the quick start, let's look at the specific methods available to you and common patterns when building cards.

![Documentation Header](../assets/@modulardocumentation.png)

## Anatomy of a Builder

When you use `new RankCard()`, you are using a specialized builder that knows exactly how to map "Game XP" to a visual progress bar. All builders inherit from a base `CardBuilder` class, meaning they share common methods like `.setUser()` and `.setTheme()`.

### Essential Methods

#### `.setUser(discordUser)`
- **Purpose**: Extracts username, tag, avatar URL, and status directly from a discord.js `User` object.
- **Tip**: This saves you from manually calling `.setUsername()` and `.setAvatar()`.

#### `.setAvatar(url_or_buffer)`
- **Purpose**: Downloads and renders the user's profile picture.
- **Note**: The engine caches downloaded avatars automatically.

#### `.setStats({ level, rank, xp, maxXp })`
- **Purpose**: Used specifically by `RankCard`. Sets the numeric text indicators and controls the progress bar fill.
- **Logic**: Percent = (xp / maxXp) * 100.

#### `.setTheme(name)`
- **Purpose**: Applies a registered theme. If the theme doesn't exist, it falls back to the `'default'` theme without crashing.

## Designing for Dark and Light

Our engine adapts to Discord beautifully.

### Transparent Cards
If you want the card to blend seamlessly into the Discord UI without a solid background, you can use themes that support transparency or override the primary surface token directly on the builder:

```javascript
card.setToken('colors.surface.primary', 'rgba(0,0,0,0)');
```

## Common Mistakes

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **Blurry Cards** | Low DPI setting | The default DPI is 2. For massive retina displays, use `.setDpi(3)`. |
| **Missing Avatar** | Broken URL or Timeout | Ensure the URL is public. The engine will render a fallback placeholder if the URL fails. |
| **Old Data Showing** | Builder reuse | Always create a new builder instance per render. Do not share a `card` object across multiple requests. |

## Performance Tip

**Reuse the Engine, Recreate the Builder.**

If you are building a production bot, initialize the engine once globally so it can cache fonts and themes, but create a new `RankCard` for every request.

```javascript
import { createEngine } from '@reformlabs/modular';

// DO THIS ONCE
const engine = createEngine({ dpi: 2 });

export async function handleRankCommand(interaction) {
  // DO THIS EVERY TIME
  await engine.createRankCard()
    .setUser(interaction.user)
    .setStats(dbStats)
    .reply(interaction);
}
```

---

Next: [Core Concepts: Themes](../core-concepts/themes.md)
