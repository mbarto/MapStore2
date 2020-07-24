const path = require("path");

const themeEntries = require('../../build/themes.js').themeEntries;
const extractThemesPlugin = require('../../build/themes.js').extractThemesPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
    base: path.join(__dirname, "..", ".."),
    dist: path.join(__dirname, "..", "..", ".."),
    framework: path.join(__dirname, "..", "..", "web", "client"),
    code: [path.join(__dirname, "..", "..", "..", "js"), path.join(__dirname, "..", "..", "web", "client")]
};

module.exports = require('../../build/buildConfig')(
    {
        'mapstore': path.join(paths.code[0], "app")
    },
    themeEntries,
    paths,
    extractThemesPlugin,
    false,
    "/",
    '.mapstore',
    [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'indexTemplate.html'),
            chunks: ['mapstore'],
            inject: "body",
            hash: true,
            filename: 'index.html'
        })
    ],
    {
        "@mapstore": path.resolve(__dirname, "..", "..", "web", "client"),
        "@js": path.resolve(__dirname, "..", "..", "..", "js")
    }
);
