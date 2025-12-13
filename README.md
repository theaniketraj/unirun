# unirun

> **Universal Run** — The last command you need to remember.

[![npm version](https://img.shields.io/npm/v/unirun.svg)](https://www.npmjs.com/package/unirun)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**unirun** is a smart CLI wrapper that automatically detects and runs the correct script for your project. Whether it's `npm run dev`, `yarn start`, `pnpm run serve`, or a direct framework command like `vite`, `unirun` handles it all with a single command.

But it doesn't stop there. **unirun** ensures your environment is **ready** before running anything — checking dependencies, setting up environment variables, and resolving port conflicts automatically.

## Features

### Smart Execution

- **Smart Detection**: Automatically finds `dev`, `start`, `serve`, or `watch` scripts.
- **Framework Magic**: Works even if `scripts` are missing by detecting frameworks like Next.js, Vite, Astro, Nuxt, etc.
- **Universal Support**: Detects `npm`, `yarn`, `pnpm`, or `bun` automatically.
- **Interactive**: Prompts you if multiple matching scripts are found.
- **Build First**: Easily run build steps with `unirun --build`.

### Profound Features (What Makes Us Different)

- **Smart Dependency Check**: Detects missing `node_modules` and prompts to install dependencies automatically. Never see "Cannot find module" errors again.
- **Environment Auto-Setup**: Finds `.env.example` or `.env.template` and offers to create your `.env` file automatically.
- **Port Conflict Resolution**: Detects when your desired port is in use and offers to:
  - Use an alternative port
  - Kill the process using the port
  - Continue anyway

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

### Quick Start

The simplest way to use **unirun** is to just run it in your project directory. It will:

1. Check if `node_modules` exists (and prompt to install if missing)
2. Check if `.env` exists (and offer to create from `.env.example` if available)
3. Detect and run the appropriate development script

```bash
unirun
```

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

## Why unirun?

### The Problem

You just cloned a repo. You don't know:

- If you need to run `npm install`, `yarn install`, or `pnpm install`
- If you need a `.env` file (and the app crashes without it)
- Which script to run: `npm run dev`, `npm start`, or something else
- If the default port is already in use

### The Solution

Just type **`unirun`**.

It checks your dependencies, creates your env file, finds the right script, resolves port conflicts, and launches your app. **It's the only command you need.**

## Example Workflow

```bash
# Clone a new project
git clone https://github.com/someone/some-project.git
cd some-project

# Instead of:
# 1. cat package.json to find the package manager
# 2. npm install
# 3. cp .env.example .env
# 4. cat package.json again to find the dev script
# 5. npm run dev

# Just run:
unirun

# Output:
# 🔍 Running pre-flight checks...
# ⚠️  node_modules is missing.
# ✓ Would you like to run 'npm install'? yes
# 📦 Installing dependencies with npm...
# ✅ Dependencies installed successfully!
# ⚠️  No .env file found, but .env.example exists.
# ✓ Create .env from .env.example? yes
# ✅ Created .env from .env.example
# ✅ All pre-flight checks passed!
# 🚀 Launching dev...
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

© MIT
