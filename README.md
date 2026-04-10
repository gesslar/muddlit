# muddlit

This extension provides for a simplified way to compile Mudlet packages
in Visual Studio Code using [@gesslar/muddy](https://www.npmjs.com/package/@gesslar/muddy).

## Commands

- `muddlit: Build with muddy` - Compiles Mudlet packages with a single command
- `muddlit: Build with muddy (watch mode)` - Compiles Mudlet packages in watch mode
- `muddlit: Generate muddy project` - Generates a new muddy project

## Documentation

### Generating a muddy project

You can use the command `muddlit: Generate muddy project` to generate a new
muddy project. This will open up a terminal and run the muddy generate
command, prompting you with several questions about your new project.

Note that the generated project will be placed in a new directory with the name
you provide. You will need to move the contents of the generated directory into
the root of your workspace/repo.

### Building with muddy

You can use the command `muddlit: Build with muddy` to compile your project.

## Credits

### muddy

- [@gesslar/muddy](https://www.npmjs.com/package/@gesslar/muddy)

### Icons

- [muddlit icons created by Slamlabs - Flaticon](https://www.flaticon.com/free-icons/muddler)

## License

`muddlit` is released under the [0BSD](LICENSE.txt).

This package includes or depends on third-party components under their own
licenses:

| Dependency | License |
| --- | --- |
| [@gesslar/toolkit](https://github.com/gesslar/toolkit) | 0BSD |
| [ps-list](https://github.com/sindresorhus/ps-list) | MIT |
