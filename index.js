const through = require('through2');
const path = require('path');
const gutil = require('gulp-util');
const File = require('vinyl');

const PLUGIN_NAME = 'gulp-export-html';

const camelCaseModuleId = (moduleId) => {
    return moduleId.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};

const generateModuleName = (options, file) => `${options.prefix}${path.basename(file.path, path.extname(file.path))}${options.suffix}`;

const generateTemplate = (string, moduleId) => (`export const ${camelCaseModuleId(moduleId)} =  \`${string.toString('utf8')}\`; \n `);

const concatTransform = (options) => {
    if (!options || typeof options !== 'string') {
       throw Error(`Option 'concat' must be a non-empty string, got: ${options}`)
    }
    let lines = [];
    let fileObj = {};
    return through.obj((file, enc, done) => {

        if (file.isStream()) {
            return done(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        if (file.isNull()) {
            return done(null, file);
        }

        const moduleId = generateModuleName(options, file);
        const result = generateTemplate(file.contents, moduleId)

        if (file.isBuffer()) {
            lines.push(result)
        }
        done()
    },
        (done) => { // flush function
            lines.push(`export default ${fileObj}`)
            this.push(new File({
                path: options.concat,
                contents: Buffer.from(lines.join('\n')),
            }))
            done();
        }
    );
}

// Windows path to Unix path
// function toUnixPath(text) {
//     return text.replace(/\\/g, '/')
// }

// function escape(text) {
//     return text.replace(/'/g, "\\'").replace(/\r\n|\n/g, '\\n')
// }

const separateTransform = (options) => {
    return through.obj((file, enc, done) => {
        if (file.isStream()) {
            return done(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        if (file.isNull()) {
            return done(null, file);
        }

        const moduleId = generateModuleName(options, file);
        const dirname = path.dirname(file.path);
        const result = generateTemplate(file.contents, moduleId)

        if (file.isBuffer()) {
            this.push(new File({
                path: `${path.join(dirname, moduleId)}.js`,
                contents: Buffer.from(result),
            }))
        }

        return done();
    });
}

module.exports = opts => {
    opts = Object.assign({}, opts)
    if (opts.concat) {
        return concatTransform(opts)
    }
    return separateTransform(opts);
};
