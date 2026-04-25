# Examples Overview

[← Back: Performance Guide](../guides/performance.md) | [Home: README →](../../README.md)

---

The best way to learn the `@reformlabs/modular` engine is by seeing it in action. Below is a conceptual overview of the different ways you can use the library. *(Note: The actual executable examples are located in the `examples/` directory of the repository, if available).*

## 🟢 Basic: For Beginners

Get started with the fundamental features using the standalone builder classes.

| Example | Description |
| :--- | :--- |
| **`RankCard` Basic** | The "Hello World" of card rendering. Standard leveling layout using `.setStats()`. |
| **`ProfileCard` Basic** | Shows simple user metadata display using `.setCustomUsername()` and `.setBadgeIds()`. |
| **`WelcomeCard` Basic** | Simple server join event card using `.setGuild()`. |

## 🟡 Theme Showcase

Explore the visual diversity of the engine's 21 built-in themes. Switch themes simply by changing a single string.

| Featured Theme | Visual Strength |
| :--- | :--- |
| `neon-tech` | Vibrant cyan/magenta glow effects. |
| `glass-modern` | Backdrop blurring and frosted glass effects with clean typography. |
| `esport` | Aggressive, high-contrast monochrome and red design for gamers. *(New in v2.1)* |
| `pink-gradient` | Soft, warm gradients. |

## 🟠 Advanced: Customization

Learn how to break out of the defaults.

| Concept | Key API |
| :--- | :--- |
| **Runtime Themes** | `engine.themeManager.register('my-brand', myThemeObj)` |
| **Parametric Backgrounds** | `.setPrimaryColor()`, `.setPatternIntensity()`, `.setGradientAngle()` on `ProfileCard` |
| **Dynamic Tokens** | `card.setToken('colors.accent.primary', '#ff0000')` |

## 🚀 Production: Bot Integration (Discord.js)

Real-world code patterns for production Discord bots.

| Use Case | Key Feature |
| :--- | :--- |
| **Slash Commands** | High-level `await card.reply(interaction)` handles deferred states automatically. |
| **Event Listeners** | `await card.send(channel)` for sending a `WelcomeCard` when `guildMemberAdd` fires. |
| **Performance** | Engine reuse: Initialize `createEngine()` once globally, create new builders per request. |

---

Want to see a specific real-world example? [Open an issue on GitHub](https://github.com/reformlabs/modular/issues) to request new examples.
