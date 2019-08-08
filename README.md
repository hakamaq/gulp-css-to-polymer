# gulp-polymer-string

A gulp plugin for converting css files into string exporting using ES6 modules. Helpful to import css in js

Modified repo you can find original here https://github.com/tommaton/gulp-css-to-polymer

## Install

### npm

```sh
$ npm install --save-dev gulp-css-to-polymer
```

### yarn

```sh
$ yarn add gulp-css-to-polymer
```

## Examples

```js
const stringlize = require('gulp-css-to-string');

// Wrap css files
gulp.task("polymerize", () => {
    gulp.src("./src/**/*.css")
        .pipe(stringlize({
            prefix: 'tg-',
            suffix: '-styles'
        }))
        .pipe(gulp.dest("./dist"));
}

```

## Options / Defaults

```js
{
    // string to be used for the beginning of the file name & module ids.
    prefix: 'tg-',
    // string to be used for the end of the file name & module ids.
    suffix: '-styles',
}
```

## LICENSE [MIT](LICENSE)
