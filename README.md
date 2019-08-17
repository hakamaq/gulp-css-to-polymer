# gulp-export-html

A gulp plugin for converting html files into string then export using ES6 modules. Helpful to import css in js or html to js.

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
const stringlize = require('gulp-export-html');

// Wrap css files
gulp.task("polymerize", () => {
    gulp.src("./src/**/*.css")
        .pipe(stringlize({
            prefix: 'tg-',
            suffix: '-styles'
            concat: 'template.js'
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
    //Merges all export const in one file and adds export default object at then end of the file
    concat: 'template.js'
}
```

## LICENSE [MIT](LICENSE)
