# Installation

The Modular Discord Card Engine is a high-performance rendering library designed for Node.js environments. It leverages native canvas bindings for maximum efficiency, making it suitable for high-traffic Discord bots.

## Prerequisites

Before installing, ensure your environment meets the following requirements:

- **Node.js**: Version 18.0.0 or higher.
- **Platform**: Supports Windows, Linux, and macOS (via NAPI-RS).
- **Architecture**: works on x64 and arm64.

## Installing the Package

Install the library using your preferred package manager:

```bash
# Using npm
npm install @modular/card-engine

# Using yarn
yarn add @modular/card-engine

# Using pnpm
pnpm add @modular/card-engine
```

## Native Dependencies

Unlike some other canvas libraries, `@modular/card-engine` uses `@napi-rs/canvas`. This means:
- **No `node-gyp` errors**: It comes with pre-built binaries.
- **No external C++ libraries**: You don't need to install `libcairo` or `libpango` on your system.
- **Fast Installation**: Direct download of the binary for your OS.

## Verification

To verify that the installation was successful, you can run a simple check:

```javascript
const { createEngine } = require('@modular/card-engine');

try {
    const engine = createEngine();
    console.log('✓ Engine initialized successfully');
    console.log('Available themes:', engine.getAvailableThemes().length);
} catch (error) {
    console.error('✗ Failed to initialize engine:', error.message);
}
```

## Troubleshooting

### "Module not found: @napi-rs/canvas"
This usually happens if the installation was interrupted. Try removing `node_modules` and the lockfile, then reinstalling.

### "GLIBC_2.XX not found" (Linux)
Ensure your Linux distribution is up to date. Most modern distros (Ubuntu 20.04+, Debian 11+, etc.) are fully supported.

---

Next: [Quick Start](./quick-start.md)
