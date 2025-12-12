# unirun

> **Universal Run** — The last command you need to remember.

[![npm version](https://img.shields.io/npm/v/unirun.svg)](https://www.npmjs.com/package/unirun)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**unirun** is a smart CLI wrapper that automatically detects and runs the correct script for your project. Whether it's `npm run dev`, `yarn start`, `pnpm run serve`, or a direct framework command like `vite`, `unirun` handles it all with a single command.

## Features

- **Smart Detection**: Automatically finds `dev`, `start`, `serve`, or `watch` scripts.
- **Framework Magic**: Works even if `scripts` are missing by detecting frameworks like Next.js, Vite, Astro, Nuxt, etc.
- **Universal Support**: Detects `npm`, `yarn`, `pnpm`, or `bun` automatically.
- **Interactive**: Prompts you if multiple matching scripts are found.
- **Build First**: Easily run build steps with `unirun --build`.

## Installation

You can use it directly via `npx`:

```bash
npx unirun
```

Or install it globally:

```bash
npm install -g unirun
```

## Usage

### Start Development Server

Just type `unirun` (or alias it to `u`). It looks for `dev`, `start`, or `serve`.

```bash
unirun
```

### Build Project

Runs your build script (`build`, `compile`, `dist`) and then starts the app.

```bash
unirun --build
```

### Production Mode

Prioritizes `start`, `run`, or `serve` over `dev`.

```bash
unirun --prod
```

### Pass Arguments

Any extra arguments are passed to the underlying script.

```bash
unirun -- --port 3000
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

© MIT
