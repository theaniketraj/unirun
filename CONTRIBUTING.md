# Contributing to unirun

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to `unirun`. These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Development Setup

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

    ```bash
    git clone https://github.com/your-username/unirun.git
    cd unirun
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Run the build** to make sure everything is working:

    ```bash
    npm run build
    ```

5. **Run tests**:

    ```bash
    npm test
    ```

## Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please include:

* A clear title and description.
* Steps to reproduce the issue.
* The expected behavior vs. the actual behavior.
* Your OS, Node.js version, and package manager.

## Pull Requests

1. Create a new branch for your feature or fix: `git checkout -b feature/amazing-feature`.
2. Commit your changes with clear messages.
3. Add tests for any new functionality.
4. Ensure all tests pass: `npm test`.
5. Push to your fork and submit a Pull Request.

## Testing

We use **Vitest** for testing. Please ensure you add unit tests for any new logic in `src/core` or `src/utils`.

```bash
npm test
```

## Style Guide

* We use **TypeScript**.
* Please follow the existing code style (Prettier/ESLint configurations will be added soon).
* Keep functions small and focused.

Thank you for contributing!
