# Documentation Structure

This file maps the full documentation directory layout for `@reformlabs/modular`.

---

## Directory Tree

```
docs/
├── structure.md                     ← This file
│
├── getting-started/
│   ├── installation.md              ← Node.js, napi-rs/canvas setup
│   ├── quick-start.md               ← First card in 2 minutes
│   └── first-card.md                ← Builder anatomy deep dive
│
├── core-concepts/
│   ├── themes.md                    ← All 21 themes, custom themes, token overrides
│   ├── render-pipeline.md           ← 9-phase pipeline reference
│   ├── builders.md                  ← All 6 builders: RankCard, ProfileCard, MusicCard, ...
│   └── system-architecture.md      ← Layers, source map, data flow, plugin design
│
├── api/
│   ├── engine.md                    ← Engine class full API
│   ├── profile-card.md              ← ProfileCard full option reference (v2.1)
│   ├── card-builder.md              ← Base CardBuilder method reference
│   ├── theme-engine.md              ← ThemeManager API
│   └── render-engine.md             ← Low-level canvas renderer
│
├── guides/
│   ├── creating-custom-theme.md     ← Step-by-step brand theme creation
│   ├── performance.md               ← Benchmarks, cache tuning, concurrency
│   └── migration-v1-v2.md          ← Breaking changes + migration steps (v2.0)
│
├── design-system/
│   └── assets-mapping.md           ← Figma → Canvas design system bridge
│
├── examples/
│   └── examples-overview.md        ← Gallery of all card types and themes
│
└── assets/
    ├── @modulardocumentation.png    ← README banner
    └── examples/
        ├── rank-cyberpunk.png
        ├── music-neon-tech.png
        ├── invite-minimal-developer.png
        └── ...
```

---

## Coverage Matrix

| Topic | File | Status |
|:------|:-----|:-------|
| Installation | `getting-started/installation.md` | ✅ |
| Quick Start | `getting-started/quick-start.md` | ✅ |
| First Card | `getting-started/first-card.md` | ✅ |
| Theme System | `core-concepts/themes.md` | ✅ Updated v2.1 |
| Render Pipeline | `core-concepts/render-pipeline.md` | ✅ Updated v2.1 |
| Card Builders | `core-concepts/builders.md` | ✅ Updated v2.1 |
| System Architecture | `core-concepts/system-architecture.md` | ✅ Updated v2.1 |
| Engine API | `api/engine.md` | ✅ New v2.1 |
| ProfileCard API | `api/profile-card.md` | ✅ New v2.1 |
| CardBuilder API | `api/card-builder.md` | ✅ |
| Theme Engine API | `api/theme-engine.md` | ✅ |
| Render Engine API | `api/render-engine.md` | ✅ |
| Custom Theme Guide | `guides/creating-custom-theme.md` | ✅ Updated v2.1 |
| Performance Guide | `guides/performance.md` | ✅ Updated v2.1 |
| Migration v1→v2 | `guides/migration-v1-v2.md` | ✅ New v2.0 |
| Design System | `design-system/assets-mapping.md` | ✅ |
| Examples Overview | `examples/examples-overview.md` | ✅ |
| CHANGELOG | `../CHANGELOG.md` | ✅ New |
| README | `../README.md` | ✅ Updated v2.1 |
