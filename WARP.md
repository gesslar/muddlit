# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

`muddlit` is a Visual Studio Code extension that simplifies compiling Mudlet packages by providing a wrapper around [@gesslar/muddy](https://www.npmjs.com/package/@gesslar/muddy), an npm tool for building Mudlet projects. This extension provides commands to build projects, watch for changes, and generate new projects.

## Architecture

### Module System

- **Type**: ES Modules (specified in package.json)
- **Entry Point**: `src/Muddlit.js` exports `activate()` and `deactivate()` functions

### Key Components

**Muddlit.js**: Extension entry point that registers VSCode commands

- Registers 4 commands: build, watch, generate, stop

**Builder.js**: Handles project building operations

- Invokes muddy via `npx @gesslar/muddy`
- Manages terminal creation and reuse

**Config.js**: Configuration management

- Provides OS platform detection

**silly-required-cjs-entrypoint.cjs**: CommonJS entry point bridge

- Exists because VSCode extensions require CJS entry points
- Imports the ES module entry point and re-exports it

## Development Commands

### Linting

```bash
npm run lint          # Check code style
npm run lint:fix      # Auto-fix style issues
```

### Building & Publishing

```bash
npm run package       # Create .vsix package file
npm run submit        # Package and open marketplace upload page
```

### Dependency Management

```bash
npm run update        # Update all dependencies interactively
```

### Development Testing

Use VSCode's "Run Extension" launch configuration (F5) to open a new VSCode window with the extension loaded for testing.

## Code Style

### ESLint Configuration

The project uses a strict stylistic configuration:

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes
- **Semicolons**: Never
- **Line Length**: 80 characters (with exceptions for comments, URLs, strings)
- **Spacing**: Specific rules for keywords, blocks, and functions
- **JSDoc**: Required with descriptions for all public functions

### Key Style Rules

- Always blank line after control statements (`if`, `for`, `while`, `switch`)
- Always blank line before `return`
- Brace style: 1tbs (one true brace style) with no single-line blocks
- Arrow functions: Parentheses only when needed
- No trailing spaces
- Object spacing: No spaces inside curly braces

### JSDoc Requirements

All public functions must have:

- Description
- `@param` with types for each parameter
- `@returns` with type if function returns a value
- Proper tag formatting with blank lines

## muddy Integration

muddy is invoked via `npx @gesslar/muddy`:

- `npx @gesslar/muddy`: Build project
- `npx @gesslar/muddy -w`: Watch mode (auto-rebuild on changes)
- `npx @gesslar/muddy --generate`: Generate new project structure

The extension:

1. Creates/reuses terminal named "muddy Build"
2. Sends commands to terminal for user visibility

## File Structure

```text
muddlit/
├── src/
│   ├── Muddlit.js              # Extension entry point
│   ├── Builder.js              # Build command handlers
│   ├── Config.js               # Configuration helpers
│   ├── ProcessWrapper.js       # Process management
│   └── silly-required-cjs-entrypoint.cjs  # CJS bridge
├── assets/
│   └── muddler.png            # Extension icon
├── .vscode/
│   └── launch.json            # Debug configuration
├── package.json               # Extension manifest
├── eslint.config.js           # Linting rules
└── jsconfig.json              # JS/TS configuration
```

## Common Workflows

### Adding a New Command

1. Define command in `package.json` under `contributes.commands`
2. Implement handler function in appropriate module (likely `Builder.js`)
3. Register command in `Muddlit.js` activate function
4. Add to context subscriptions for proper cleanup
5. Update README.md with command documentation

### Error Handling Patterns

- Use `vscode.window.showErrorMessage()` for user-facing errors
- Use `console.error()` for debug logging
- Clean up resources (files, streams) in error handlers
- Provide helpful context in error messages
