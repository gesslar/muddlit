# Changelog

## [1.0.1] - 2026-04-07

### Fixed

- Extension failing to activate when installed from VSIX (dependencies not bundled)

### Changed

- Bundle extension with esbuild so all dependencies are included in the package

## [1.0.0] - 2026-04-07

### Added

- Build command to run muddy builds from VS Code
- Watch mode command for continuous muddy builds
- Generate command to scaffold a new muddy project
- Stop command to terminate watch mode
