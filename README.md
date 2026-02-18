# @osn/modular

A production-grade, high-performance canvas rendering engine for Discord cards. Built with Node.js and explicitly designed for scalability, customizability, and professional developer experience.

![Documentation Header](./docs/assets/@modulardocumentation.png)

## 🚀 The 2-Minute Quick Start

```bash
npm install @osn/modular
```

```javascript
import { RankCard } from '@osn/modular';

const buffer = await new RankCard()
    .setUsername('Senior Developer')
    .setAvatar('https://github.com/manymq.png')
    .setTheme('neon-tech')
    .render();
```

## 📖 Comprehensive Documentation

### 🏁 Getting Started
- **[Installation Guide](./docs/getting-started/installation.md)**: Prerequisites and native setup.
- **[First Card Walkthrough](./docs/getting-started/first-card.md)**: Detailed breakdown of the builder API.

### 🧠 Core Architecture
- **[The Theme System](./docs/core-concepts/themes.md)**: Understanding tokens, effects, and branding.
- **[The Render Pipeline](./docs/core-concepts/render-pipeline.md)**: A deep dive into the 9 rendering stages.
- **[Card Builders](./docs/core-concepts/builders.md)**: Why and how to use specialized builders.

### 🛠️ Production Guides
- **[Performance & Optimization](./docs/guides/performance.md)**: Memory management, workers, and scaling.
- **[Custom Theme Creation](./docs/guides/creating-custom-theme.md)**: Building your brand in code.
- **[Design System Mapping](./docs/design-system/assets-mapping.md)**: Bridge the gap between Figma and Canvas.

### 📑 API Reference
- **[CardBuilder API](./docs/api/card-builder.md)**: Exhaustive method reference.
- **[Theme engine API](./docs/api/theme-engine.md)**: Registration and token handling.
- **[Render Engine API](./docs/api/render-engine.md)**: Low-level canvas control.

## 🖼️ Examples
Explore a wide range of use cases from **[basic rank cards](./examples/basic/rank-basic.js)** to **[advanced custom layouts](./examples/advanced/custom-layout.js)**. See the **[full examples overview](./docs/examples/examples-overview.md)** for more.

## ❤️ Contributing
We welcome contributions! Please see our architecture guide before submitting a PR.

## 📜 License
MIT
