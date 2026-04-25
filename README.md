# @reformlabs/modular

![Documentation Header](./docs/assets/@modulardocumentation.png)

`@reformlabs/modular` is a **production-grade, high-performance** canvas rendering engine specifically built for Discord card generation. Unlike generic canvas wrappers, it implements a professional **Design-to-Code pipeline** that separates data logic from visual presentation.

[![npm version](https://img.shields.io/badge/npm-v2.1.0-blue)](https://www.npmjs.com/package/@reformlabs/modular)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-yellow)](./LICENSE)

---

## ✨ Key Features

- 🚀 **Extreme Performance** — Built on `@napi-rs/canvas` (Rust-backed). Profile cards render in ~44 ms.
- 🎨 **21 Built-In Themes** — `neon-tech`, `glass-modern`, `esport`, `cyberpunk`, and more. Switch with a single string.
- 🧠 **Fluent Builder API** — Chainable, type-safe methods for every card type.
- 💎 **Pixel-Perfect Scaling** — DPI up to 4× for retina displays.
- 🧩 **Extensible Architecture** — Plugins, hooks, custom components, custom themes.
- 🛡️ **Type Safe** — Full TypeScript support with exhaustive type definitions.
- 📬 **Discord.js Integration** — `.reply()`, `.followUp()`, `.send()` built in.
- 🎛️ **Parametric Backgrounds** — Integer-controlled color, blur, pattern, and gradient angle on Profile cards. *(v2.1)*

---

## 🚀 The 2-Minute Quick Start

```bash
npm install @reformlabs/modular
```

```js
import { RankCard } from '@reformlabs/modular';

// Render to Buffer:
const buffer = await new RankCard()
  .setUsername('Senior Developer')
  .setAvatar('https://github.com/manymq.png')
  .setStats({ level: 15, xp: 7300, maxXp: 10000, rank: 3 })
  .setTheme('neon-tech')
  .render();

// Or reply directly to a Discord slash command:
await new RankCard()
  .setUser(interaction.user)
  .setStats(await db.getStats(interaction.user.id))
  .setTheme('cyberpunk')
  .reply(interaction);
```

---

## 🃏 Card Types

| Class | Factory | Description |
|:------|:--------|:-----------|
| `RankCard` | `engine.createRankCard()` | XP bar, level badge, rank position |
| `ProfileCard` | `engine.createProfileCard()` | Full profile with badges, status, parametric background |
| `MusicCard` | `engine.createMusicCard()` | Now Playing with album art and progress |
| `Leaderboard` | `engine.createLeaderboardCard()` | Server leaderboard with ranked entries |
| `InviteCard` | `engine.createInviteCard()` | Invite stats with milestone progress |
| `WelcomeCard` | `engine.createWelcomeCard()` | Server welcome card |

---

## 🖼️ Examples Gallery

| Rank Card | Music Card | Profile Card |
| :---: | :---: | :---: |
| ![Rank](./docs/assets/examples/rank-cyberpunk.png) | ![Music](./docs/assets/examples/music-neon-tech.png) | ![Invite](./docs/assets/examples/invite-minimal-developer.png) |
| `cyberpunk` | `neon-tech` | `glass-modern` |

Explore the **[Full Examples Overview](./docs/examples/examples-overview.md)** for more.

---

## 🗺️ Documentation Map

### 🏁 Level 1: Getting Started
1. **[Installation Guide](./docs/getting-started/installation.md)** — Setting up the native environment.
2. **[Quick Start](./docs/getting-started/quick-start.md)** — Generate your first card in 2 minutes.
3. **[First Card In-Depth](./docs/getting-started/first-card.md)** — Understanding the builder anatomy.

### 🧠 Level 2: Core Concepts
4. **[The Theme System](./docs/core-concepts/themes.md)** — All 21 themes, custom themes, token overrides.
5. **[Render Pipeline](./docs/core-concepts/render-pipeline.md)** — The 9-phase pipeline from data to pixels.
6. **[Card Builders](./docs/core-concepts/builders.md)** — All 6 builders with full method reference.
7. **[System Architecture](./docs/core-concepts/system-architecture.md)** — Layers, source map, data flow.

### 📑 Level 3: API Reference
8. **[Engine API](./docs/api/engine.md)** — Factory methods, plugins, hooks, cache, events.
9. **[ProfileCard API](./docs/api/profile-card.md)** — Full ProfileCard option reference (v2.1).
10. **[CardBuilder API](./docs/api/card-builder.md)** — Base builder method reference.
11. **[Theme Engine API](./docs/api/theme-engine.md)** — Registering and managing themes.
12. **[Render Engine API](./docs/api/render-engine.md)** — Low-level canvas controls.

### 🛠️ Level 4: Advanced Guides
13. **[Custom Theme Creation](./docs/guides/creating-custom-theme.md)** — Building your own brand theme.
14. **[Performance & Scaling](./docs/guides/performance.md)** — Benchmarks, cache tuning, concurrency.
15. **[Migration: v1 → v2](./docs/guides/migration-v1-v2.md)** — Breaking changes and migration steps.
16. **[Design System Mapping](./docs/design-system/assets-mapping.md)** — Bridging Figma and Canvas.

---

## 📦 What's New in v2.1

- **ProfileCard Parametric Background** — Control background color, blur, pattern density, and gradient angle with integer-typed setters.
- **Status & Tooltip Badge** — `.setStatus()` and `.setTooltipBadgeId()` on ProfileCard.
- **Rank Data Overlay** — Embed an XP bar directly on the ProfileCard via `.setRankData()`.
- **`esport` Theme** — 21st built-in theme added.
- **`ThemeManager.getToken()`** — Dot-path token retrieval from any theme.
- **Memory Safety** — `renderContext.release()` is now guaranteed in a `finally` block.

See the full **[CHANGELOG](./CHANGELOG.md)** for details.

---

## 🏗️ Project Structure

```
src/
├── index.ts               — Public API (all exports)
├── core/                  — Engine, builders, pipeline, domain modules
│   └── internal/cards/    — rank / profile / music / leaderboard / invite / welcome
└── canvas/                — Renderers, components, themes, styling

docs/                      — Full documentation
tests/                     — Unit + visual regression tests
scripts/                   — validate / smoke / perf tools
```

Full directory reference: [docs/structure.md](./docs/structure.md)

---

## ❤️ Contributing

We welcome contributions! Please read the [System Architecture](./docs/core-concepts/system-architecture.md) guide before submitting a PR to understand how the layers interact.

## 📜 License

MIT — see [LICENSE](./LICENSE)
