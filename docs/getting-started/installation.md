# Installation Guide

![Installation](../assets/@modularinstallation.png)

[← Back to README](../../README.md) | [Next: Quick Start →](./quick-start.md)

---

`@reformlabs/modular` is a high-performance rendering engine designed for Node.js environments. It leverages native canvas bindings via Rust (`@napi-rs/canvas`) for maximum efficiency, making it perfectly suited for high-traffic Discord bots.

## Prerequisites

Before installing, ensure your environment meets the following requirements:

- **Node.js**: Version 18.0.0 or higher.
- **Platform**: Supports Windows, Linux, and macOS.
- **Architecture**: Supports x64 and arm64.

## Installing the Package

Install the library using your preferred package manager:

```bash
# Using npm
npm install @reformlabs/modular

# Using yarn
yarn add @reformlabs/modular

# Using pnpm
pnpm add @reformlabs/modular

# Using bun
bun add @reformlabs/modular
```

## Native Dependencies

Unlike older canvas libraries (like `canvas` or `canvas-constructor`), `@reformlabs/modular` uses `@napi-rs/canvas`. This means:
- **No `node-gyp` compile errors**: It comes with pre-built binaries.
- **No external C++ libraries**: You don't need to manually install `libcairo`, `libpango`, or `libjpeg-dev` on your system.
- **Fast Installation**: Direct download of the compiled binary for your OS.

## Verification

To verify that the installation was successful, create a `test.js` file:

```javascript
import { createEngine, getAvailableThemes } from '@reformlabs/modular';

try {
    const engine = createEngine();
    console.log('✓ Engine initialized successfully');
    console.log(`Available themes: ${getAvailableThemes().length}`);
} catch (error) {
    console.error('✗ Failed to initialize engine:', error.message);
}
```

Run it via `node test.js`. You should see successful output indicating 21 available themes.

## Troubleshooting

### "Module not found: @napi-rs/canvas"
This usually happens if the installation was interrupted or your package manager failed to download the optional native binaries. Try removing `node_modules` and the lockfile, then reinstalling.

### "GLIBC_2.XX not found" (Linux)
Ensure your Linux distribution is up to date. Most modern distros (Ubuntu 20.04+, Debian 11+, Node.js official Docker images) are fully supported. If you use Alpine Linux, switch to the standard Debian-based Node image (`node:18` instead of `node:18-alpine`).

---

[← Back to README](../../README.md) | [Next: Quick Start →](./quick-start.md)
