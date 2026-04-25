# ProfileCard API Reference

`ProfileCard` is the most feature-rich card in `@reformlabs/modular`. It renders a full Discord-style user profile with a parametric background, badges, status indicator, and an optional XP overlay.

---

## Import

```js
import { ProfileCard } from '@reformlabs/modular';
// or CommonJS:
const { ProfileCard } = require('@reformlabs/modular');
```

---

## Quick Example

```js
import { ProfileCard } from '@reformlabs/modular';

const buffer = await new ProfileCard()
  .setUser(discordUser)
  .setJoinDate(member.joinedAt)
  .setBadgeIds([1, 3, 7])
  .setPrimaryColor([108, 123, 255])
  .setSecondaryColor([183, 194, 255])
  .setStatus('online')
  .setTheme('minimal-developer')
  .render();
```

---

## Control Options (Integer-Based API)

These options use **integer IDs** to select pre-designed visual states — they are validated strictly.

### `.setProfilePhotoId(id)` — `ProfilePhotoId: 1 | 2 | 3 | 4`

Selects the avatar frame/style variant.

| ID | Style |
|:---|:------|
| 1  | Rounded circle (default) |
| 2  | Square with rounded corners |
| 3  | Hexagonal frame |
| 4  | Diamond frame |

```js
card.setProfilePhotoId(2); // square avatar style
```

---

### `.setBackgroundThemeId(id)` — `BackgroundThemeId: 1 | 2 | 3`

Selects a background layout variant (affects how gradient/pattern is composed).

```js
card.setBackgroundThemeId(2);
```

---

### `.setBadgeIds(ids)` — `ProfileBadgeId[]: 1–12`

Sets which badges to display. Accepts an array of integers 1–12. Duplicate IDs are silently dropped.

```js
card.setBadgeIds([1, 3, 7, 12]);
```

---

### `.setJoinDateOffset(offset)` — `JoinDateOffset: 1 | 2 | 3`

Controls how the join date is formatted:

| ID | Format |
|:---|:-------|
| 1  | Relative (e.g., "2 years ago") — default |
| 2  | Short date (e.g., "Apr 2024") |
| 3  | Full date (e.g., "April 25, 2024") |

```js
card.setJoinDateOffset(3); // full date
```

---

### `.setInfoDisplayFlag(flag)` — `InfoDisplayFlag: 1 | 2 | 3`

Controls which info row is shown beneath the username:

| ID | Shows |
|:---|:------|
| 1  | Join date only |
| 2  | Join date + discriminator/tag (default) |
| 3  | Subtitle text |

```js
card.setInfoDisplayFlag(3).setCustomSubtitle('Lead Developer');
```

---

## Parametric Background Options (v2.1+)

These options control the procedurally generated background gradient.

### `.setPrimaryColor(rgb)` — `[R, G, B]`

Sets the dominant background color as an RGB integer tuple. Each channel must be 0–255.

```js
card.setPrimaryColor([108, 123, 255]); // indigo-blue
card.setPrimaryColor([255, 87, 34]);   // deep orange
```

---

### `.setSecondaryColor(rgb)` — `[R, G, B]`

Sets the secondary background gradient color.

```js
card.setSecondaryColor([183, 194, 255]);
```

---

### `.setPatternIntensity(value)` — `0–100`

Controls the opacity/density of the background pattern overlay.

```js
card.setPatternIntensity(0);   // no pattern
card.setPatternIntensity(50);  // moderate
card.setPatternIntensity(100); // full intensity
```

---

### `.setBlurAmount(value)` — `0–20`

Gaussian blur applied to the background (in units, not pixels).

```js
card.setBlurAmount(0);  // sharp background
card.setBlurAmount(12); // default — softened
card.setBlurAmount(20); // maximum blur
```

---

### `.setGradientAngle(degrees)` — `0–360`

Sets the angle of the background gradient.

```js
card.setGradientAngle(0);    // left → right
card.setGradientAngle(90);   // top → bottom
card.setGradientAngle(135);  // diagonal (default)
```

---

## Status & Tooltip (v2.1+)

### `.setStatus(status)` — `'online' | 'idle' | 'dnd' | 'offline'`

Sets the Discord-style presence dot displayed on the avatar.

```js
card.setStatus('dnd');
```

---

### `.setTooltipBadgeId(id)` — `ProfileBadgeId | null`

Pins a badge and enables its tooltip display. Pass `null` to disable.

```js
card.setTooltipBadgeId(7); // badge 7 with tooltip
card.setTooltipBadgeId(null); // no tooltip
```

---

## Advanced / Cosmetic Options

### `.setCustomUsername(name)`
Overrides the username displayed on the card (does not change underlying user data).

```js
card.setCustomUsername('Senior Dev');
```

### `.setCustomTag(tag)`
Overrides the `#tag` displayed below the username.

```js
card.setCustomTag('#1337');
```

### `.setCustomSubtitle(text)`
Sets the subtitle line (shown when `infoDisplayFlag = 3`).

```js
card.setCustomSubtitle('ReformLabs — Lead Engineer');
```

### `.setCustomBadges(urls)`
Provides an array of custom badge image URLs (must be accessible at render time).

```js
card.setCustomBadges([
  'https://cdn.example.com/badge-gold.png',
  'https://cdn.example.com/badge-verified.png'
]);
```

### `.setOverwriteBadges(bool)`
If `true`, `customBadges` entirely replace the default badge set.

### `.setBadgesFrame(bool)`
Enables/disables the decorative frame around the badge row.

### `.setRemoveBadges(bool)`
Hides the entire badge row.

### `.setRemoveBorder(bool)`
Hides the avatar/card border.

### `.setUsernameColor(css)`
Sets the username text color.

```js
card.setUsernameColor('#FFD700');
```

### `.setTagColor(css)`
Sets the tag text color.

### `.setBorderColor(color)` — `string | [string, string] | string[]`
Sets the border color. Accepts a hex string, or an array for gradient borders.

```js
card.setBorderColor('#6366f1');
card.setBorderColor(['#6366f1', '#8b5cf6']); // gradient
```

### `.setBorderAlign(direction)`
CSS gradient direction string for gradient borders.

```js
card.setBorderAlign('to bottom right');
```

### `.setDisableProfileTheme(bool)`
Disables the card's default profile theme override (uses engine default instead).

### `.setPresenceStatus(string | null)`
Custom presence text string (e.g., `'Playing Minecraft'`). Set to `null` to hide.

### `.setSquareAvatar(bool)`
Forces the avatar to be square-cropped.

### `.setRemoveAvatarFrame(bool)`
Removes the decorative ring/frame around the avatar.

### `.setMoreBackgroundBlur(bool)`
Enables an additional blur pass on the background.

### `.setBackgroundBrightness(value)` — `1–100`
Controls overall background brightness percentage.

### `.setCustomDate(date)`
Overrides the join date shown on the card. Accepts a `Date` object or ISO string.

```js
card.setCustomDate(new Date('2023-01-15'));
card.setCustomDate('2023-01-15T00:00:00Z');
```

### `.setLocalDateType(locale)`
Locale string for date formatting (e.g., `'en'`, `'tr'`, `'de'`).

```js
card.setLocalDateType('tr'); // Turkish date format
```

### `.setJoinDate(date)`
Sets the raw join date (separate from `customDate`). Accepts `Date` or string.

```js
card.setJoinDate(member.joinedAt);
```

### `.setBanner(url)`
Sets a custom banner image URL displayed at the top of the card.

```js
card.setBanner('https://cdn.example.com/banner.png');
```

### `.setField(key, value)`
Sets an arbitrary extra field on the card data (for custom renderer use).

---

## Rank Data Overlay (v2.1+)

### `.setRankData(rankData)`

Embeds an XP progress bar and rank info directly on the profile card. Pass `null` to hide.

```ts
type ProfileRankData = {
  currentXP?: number;
  requiredXP?: number;
  level?: number;
  rank?: number;
  barColor?: string;
}
```

```js
card.setRankData({
  currentXP: 3400,
  requiredXP: 5000,
  level: 12,
  rank: 3,
  barColor: '#7c3aed'
});

// Remove rank overlay:
card.setRankData(null);
```

---

## Inherited Base Methods

All `ProfileCard` methods below are inherited from `CardBuilder`:

| Method | Description |
|:-------|:-----------|
| `.setUser(discordUser)` | Populate username, avatar, tag, status from a Discord.js User object |
| `.setAvatar(url)` | Set avatar URL directly |
| `.setTheme(name)` | Set the visual theme |
| `.setDpi(dpi)` | Set DPI scaling (1–4) |
| `.setSize(w, h)` | Set card dimensions |
| `.render()` | → `Promise<Buffer>` |
| `.toBuffer()` | Alias for `.render()` |
| `.reply(interaction)` | Reply to a Discord interaction |
| `.followUp(interaction)` | Follow-up to an interaction |
| `.send(channel)` | Send to a channel |

---

## Default Values

| Option | Default |
|:-------|:--------|
| `profilePhotoId` | `1` |
| `backgroundThemeId` | `1` |
| `badgeIds` | `[]` |
| `joinDateOffset` | `1` |
| `infoDisplayFlag` | `2` |
| `primary_color` | `[108, 123, 255]` |
| `secondary_color` | `[183, 194, 255]` |
| `pattern_intensity` | `15` |
| `blur_amount` | `12` |
| `gradient_angle` | `135` |
| `status` | `'online'` |
| `usernameColor` | `'#FFFFFF'` |
| `tagColor` | `'rgba(255,255,255,0.7)'` |
| `borderColor` | `'#6366f1'` |
| `backgroundBrightness` | `100` |
| `localDateType` | `'en'` |

---

## Validation Errors

The following will throw a `ValidationError`:

- `profilePhotoId` outside 1–4
- `backgroundThemeId` outside 1–3
- `badgeIds[]` element outside 1–12
- `joinDateOffset` outside 1–3
- `infoDisplayFlag` outside 1–3
- `primary_color` / `secondary_color` — not a 3-element array, or any channel outside 0–255
- `pattern_intensity` outside 0–100
- `blur_amount` outside 0–20
- `gradient_angle` outside 0–360
- `backgroundBrightness` outside 1–100
