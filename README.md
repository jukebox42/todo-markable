# Remarkable Todo

A simple todo application for the Remarkable paper tablet, you feed it a json file and it outputs a
pdf todo list with tabs.

## Usage

```bash
# Without an output it will place the files in output.pdf
yarn start generate pages.json

# Full props
yarn start generate pages.json --output todo.pdf
```

Commands
- `--output` - Specify the output file. Defaults to `output.pdf`.
- `--tall` - Specify if you want pages to be twice as tall as the screen size. Defaults to `false`.
- `--remove-todo` - Removes the first "TODO" page. Defaults to `false`.
- `--remove-notes` - Removes the ending notes page. Defaults to `false`.
- `--debug` - Generates a `debug.html` file of the PDF. Useful for debugging... Defaults to `false`.

## Setup

```bash
yarn install
yarn build
```