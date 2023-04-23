# Cloak Data Editor

## About

This app is an editor for Cloak's game data. It is currently still being developed, but will soon support creating new and modifying existing game data. You can view it in its current state on [GitHub Pages](https://nathan-starkey.github.io/cloak-data-editor/).

Read on for information about building and extending the project.

## Workflow

### Setup

The following technologies are used to build this project:

- [npm](https://npmjs.org/) to manage 3rd-party packages
- [Sass](https://sass-lang.com/) to compile SCSS into CSS files
- [nodemon](https://nodemon.io/) to reload the `pug-compile` script

Each of these provide necessary CLI tools used to build this project. Install them according to their own directions. Finally, run `npm install` in the root directory to install the project's dependencies.

### Project

The source files are located in 'src' (see below for an exception*), and the build output in 'dist'. Build scripts are located in the root directory. The project uses [Pug](https://pugjs.org/) to allow for modular HTML content, and Sass to extend Bootstrap 5 creating a custom theme for this project.

*JavaScript files are located in 'dist'. Keeping source code in the same folder as build output is not best practise, so all suggestions are welcome.

### npm scripts

The following commands can be run in the root directory:

* `npm run compile`

  Compile Pug and Sass files into the dist folder.

* `npm run watch`

  Continually compile Pug and Sass files, watching for file changes.

* `npm run pug-compile`

  `npm run pug-watch`

  Same as above, exclusively with Pug files.

* `npm run sass-compile`

  `npm run sass-watch`

  Same as above, exclusively with Sass files.
