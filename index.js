const through = require('through2');
const path = require('path');
const gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-css-to-string';

const camelCaseModuleId = (moduleId) => {
    return moduleId.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};

const generateModuleName = (options, file) => `${options.prefix}${path.basename(file.path, path.extname(file.path))}${options.suffix}`;


// const generatePWAStyle = (styles, moduleId) => (`import { html } from '@polymer/lit-element';
// export const ${camelCaseModuleId(moduleId)} = html \`
const generatePWAStyle = (styles, moduleId) => (`

            export const ${camelCaseModuleId(moduleId)} =  \`
            <style>
                ${styles.toString('utf8')}
            </style>\`;
            `
);

module.exports = opts => through.obj((file, enc, cb) => {
    const fileObj = file;
    // const fileName = path.basename(file.path);
    const moduleId = generateModuleName(opts, file);
    const dirname = path.dirname(file.path);

    if (file.isStream()) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    if (file.isNull()) {
        return cb(null, file);
    }

    const res = generatePWAStyle(file.contents, moduleId)

    fileObj.contents = Buffer.from(res);
    fileObj.path = `${path.join(dirname, moduleId)}.js`;

    return cb(null, file);

});
