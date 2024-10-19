# muddlit

This extension provides for a simplified way to compile Mudlet packages
in Visual Studio Code.

## Commands

- `muddlit: Download Muddler` - Downloads Muddler
- `muddlit: Build with Muddler` - Compiles Mudlet packages with a single command
- `muddlit: Watch with Muddler (watch mode)` - Compiles Mudlet packages in watch mode
- `muddlit: Generate Muddler project` - Generates a new Muddler project

## Settings

- `muddlit.muddlerPath` - The path to the Muddler script directory

## Documentation

### Downloading Muddler

If you don't already have Muddler, you can use the command `muddlit: Download Muddler` to download it from the Command Palette.

If you already have Muddler, you can set the path to the Muddler script
directory in the settings.

Downloading Muddler via the command will set the path for you.

### Generating a Muddler project

You can use the command `muddlit: Generate Muddler project` to generate a new
Muddler project. This will open up a terminal and run the Muddler generate
command, prompting you with several questions about your new project.

Note that the generated project will be placed in a new directory with the name
you provide. You will need to move the contents of the generated directory into
the root of your workspace/repo.

### Building with Muddler

You can use the command `muddlit: Build with Muddler` to compile your project.


## Credits

### Muddler

- [muddler](https://github.com/demonnic/muddler)

### Icons

- [Muddler icons created by Slamlabs - Flaticon](https://www.flaticon.com/free-icons/muddler)
