# ProfileCard Configuration Reference

`ProfileCard` is the most configurable card in `@reformlabs/modular`. Its options are split into two groups:

- **Control Options** (`ProfileCardControlOptions`) — integer-typed selectors for layout variants and parametric background
- **Advanced Options** (`ProfileCardAdvancedOptions`) — string/boolean cosmetic overrides

For the full setter API see [ProfileCard API Reference](../api/profile-card.md). This page is a quick-reference config cheat sheet.

---

## Option Groups

### Text

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `customUsername` | `.setCustomUsername(s)` | `string \| null` | `null` (uses Discord username) |
| `customTag` | `.setCustomTag(s)` | `string \| null` | `null` (uses Discord tag) |
| `customSubtitle` | `.setCustomSubtitle(s)` | `string \| null` | `null` |
| `usernameColor` | `.setUsernameColor(css)` | `string` | `'#FFFFFF'` |
| `tagColor` | `.setTagColor(css)` | `string` | `'rgba(255,255,255,0.7)'` |

---

### Layout Variants (Integer Controls)

| Option | Setter | Type | Range | Default |
|:-------|:-------|:-----|:------|:--------|
| `profilePhotoId` | `.setProfilePhotoId(n)` | `1\|2\|3\|4` | 1–4 | `1` |
| `backgroundThemeId` | `.setBackgroundThemeId(n)` | `1\|2\|3` | 1–3 | `1` |
| `joinDateOffset` | `.setJoinDateOffset(n)` | `1\|2\|3` | 1–3 | `1` |
| `infoDisplayFlag` | `.setInfoDisplayFlag(n)` | `1\|2\|3` | 1–3 | `2` |

---

### Parametric Background (v2.1+)

| Option | Setter | Type | Range | Default |
|:-------|:-------|:-----|:------|:--------|
| `primary_color` | `.setPrimaryColor([R,G,B])` | `[number,number,number]` | 0–255 each | `[108,123,255]` |
| `secondary_color` | `.setSecondaryColor([R,G,B])` | `[number,number,number]` | 0–255 each | `[183,194,255]` |
| `pattern_intensity` | `.setPatternIntensity(n)` | `number` | 0–100 | `15` |
| `blur_amount` | `.setBlurAmount(n)` | `number` | 0–20 | `12` |
| `gradient_angle` | `.setGradientAngle(n)` | `number` | 0–360 | `135` |

---

### Status & Tooltip (v2.1+)

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `status` | `.setStatus(s)` | `'online'\|'idle'\|'dnd'\|'offline'` | `'online'` |
| `tooltipBadgeId` | `.setTooltipBadgeId(n)` | `1–12 \| null` | `null` |

---

### Badges

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `badgeIds` | `.setBadgeIds([1,3,7])` | `number[]` (1–12) | `[]` |
| `customBadges` | `.setCustomBadges(urls)` | `string[]` | `[]` |
| `overwriteBadges` | `.setOverwriteBadges(bool)` | `boolean` | `false` |
| `badgesFrame` | `.setBadgesFrame(bool)` | `boolean` | `false` |
| `removeBadges` | `.setRemoveBadges(bool)` | `boolean` | `false` |

> `customBadges` URLs should point to `46×46` px images for correct rendering.  
> When `overwriteBadges: true`, `customBadges` entirely replace the system badge set.

---

### Background

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `customBackground` | `.setCustomBackground(url)` | `string \| null` | `null` |
| `moreBackgroundBlur` | `.setMoreBackgroundBlur(bool)` | `boolean` | `false` |
| `backgroundBrightness` | `.setBackgroundBrightness(n)` | `number` (1–100) | `100` |
| `disableProfileTheme` | `.setDisableProfileTheme(bool)` | `boolean` | `false` |

---

### Avatar

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `squareAvatar` | `.setSquareAvatar(bool)` | `boolean` | `false` |
| `removeAvatarFrame` | `.setRemoveAvatarFrame(bool)` | `boolean` | `false` |
| `presenceStatus` | `.setPresenceStatus(s)` | `string \| null` | `null` |

---

### Border

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `removeBorder` | `.setRemoveBorder(bool)` | `boolean` | `false` |
| `borderColor` | `.setBorderColor(color)` | `string \| [string, string] \| string[]` | `'#6366f1'` |
| `borderAlign` | `.setBorderAlign(dir)` | `string` | `'to bottom right'` |

Pass an array to `borderColor` for a gradient border:
```js
card.setBorderColor(['#00fbff', '#6366f1']).setBorderAlign('to bottom right');
```

---

### Rank Data Overlay

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `rankData` | `.setRankData(data)` | `ProfileRankData \| null` | `null` |

```ts
type ProfileRankData = {
  currentXP?: number;
  requiredXP?: number;
  level?: number;
  rank?: number;
  barColor?: string;
};
```

```js
card.setRankData({
  currentXP: 640,
  requiredXP: 1000,
  level: 27,
  rank: 1,
  barColor: '#00fbff'
});
```

Pass `null` to hide the rank overlay.

---

### Date

| Option | Setter | Type | Default |
|:-------|:-------|:-----|:--------|
| `customDate` | `.setCustomDate(date)` | `Date \| string \| null` | `null` |
| `localDateType` | `.setLocalDateType(locale)` | `string` | `'en'` |

```js
card.setCustomDate(member.joinedAt).setLocalDateType('de'); // German format
```

---

## Full Example

```js
import { ProfileCard } from '@reformlabs/modular';

const buffer = await new ProfileCard()
  // Text overrides
  .setCustomUsername('iAsure')
  .setCustomTag('@iasure')
  .setCustomSubtitle('Discord-Inspired Design!')
  .setPresenceStatus('Playing Visual Studio Code')
  // Layout variants
  .setProfilePhotoId(2)
  .setInfoDisplayFlag(3)       // show subtitle
  // Parametric background (v2.1)
  .setPrimaryColor([0, 251, 255])
  .setSecondaryColor([99, 102, 241])
  .setPatternIntensity(20)
  .setBlurAmount(10)
  .setGradientAngle(135)
  // Status
  .setStatus('online')
  // Badges
  .setBadgeIds([7, 8, 1, 4])
  .setBadgesFrame(true)
  // Background
  .setMoreBackgroundBlur(true)
  .setBackgroundBrightness(80)
  // Border
  .setBorderColor(['#00fbff', '#6366f1'])
  .setBorderAlign('to bottom right')
  // Rank overlay
  .setRankData({ level: 27, currentXP: 640, requiredXP: 1000, rank: 1, barColor: '#00fbff' })
  // Theme
  .setTheme('glass-modern')
  .render();
```

---

## Related

- [ProfileCard API Reference](../api/profile-card.md) — Full setter descriptions with validation rules
- [Theme System](../core-concepts/themes.md) — Available themes and token overrides
- [Builder Configuration](./builder.md) — Dimensions, DPI, and output format
