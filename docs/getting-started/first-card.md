# Your First Card: In-Depth

Now that you've run the quick start, let's look at the specific methods available to you and the common pitfalls when building cards.

![Documentation Header](../assets/@modulardocumentation.png)

## Anatomy of a Rank Card

When you use `engine.createRankCard()`, you are using a specialized builder that knows exactly how to map "Game XP" to a visual progress bar.

### Essential Methods

#### `.setUsername(name)`
- **Purpose**: Sets the primary display name on the card.
- **Tip**: We automatically truncate names that are too long to prevent layout breaking.

#### `.setAvatar(url_or_buffer)`
- **Purpose**: Downloads and renders the user's profile picture.
- **Advanced**: You can pass a direct image `Buffer` if you've already fetched it.

#### `.setLevel(number)`
- **Purpose**: Displays the prominent level badge.
- **Note**: Some themes (like `neon-tech`) render this as a circular ring around the avatar.

#### `.setXP(current, max)`
- **Purpose**: Controls the progress bar percentage.
- **Logic**: Percent = (Current / Max) * 100.

## Designing for Dark and Light

Our engine adapts to the background of Discord perfectly. 

### Transparent Cards
If you want the card to blend into the Discord UI without a solid background, you can use themes that support transparency or override the background token:

```javascript
card.setToken('surface.primary', 'rgba(0,0,0,0)');
```
## Common Mistakes

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **Blurry Cards** | Low DPI setting | The default DPI is 2. For retina displays, use `createEngine({ dpi: 3 })`. |
| **Missing Avatar** | Broken URL or Timeout | Ensure the URL is public. Use a fallback image if `setAvatar()` fails. |
| **Old Data Showing** | Builder reuse | Always create a new builder instance per render: `engine.createRankCard()`. |

## Performance Tip

**Don't re-initialize the Engine.**
The `Engine` instance caches themes, fonts, and assets internally. Create it once at the top of your file or in your bot's `index.js` and reuse it for every card request.

---

Next: [Core Concepts: Themes](../core-concepts/themes.md)
