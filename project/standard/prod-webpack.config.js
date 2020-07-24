const path = require("path");

const themeEntries = require('../../build/themes.js').themeEntries;
const extractThemesPlugin = require('../../build/themes.js').extractThemesPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = {
    base: path.join(__dirname, "..", ".."),
    dist: path.join(__dirname, "..", "..", "..", "build", "frontend", "dist"),
    framework: path.join(__dirname, "..", "..", "web", "client"),
    code: [path.join(__dirname, "..", "..", "..", "js"), path.join(__dirname, "..", "..", "web", "client")]
};

module.exports = require('../../build/buildConfig')(
    {
        'mapstore': path.join(paths.code[0], "app"),
        'mapstore-embedded': path.join(paths.code[1], "product", "embedded"),
        'mapstore-api': path.join(paths.code[1], "product", "api")
    },
    themeEntries,
    paths,
    extractThemesPlugin,
    true,
    "dist/",
    '.mapstore',
    [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'indexTemplate.html'),
            chunks: ['mapstore'],
            inject: "body",
            hash: true,
            filename: '../index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'embeddedTemplate.html'),
            chunks: ['mapstore-embedded'],
            inject: "body",
            hash: true,
            filename: '../embedded.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'apiTemplate.html'),
            chunks: ['mapstore-api'],
            inject: 'head',
            hash: true,
            filename: '../api.html'
        }),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'configs'), to: path.join(paths.dist, "..", "configs") }
        ]),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'translations'), to: path.join(paths.dist, "..", "MapStore2", "web", "client", "translations") }
        ]),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'unsupportedBrowser.html'), to: path.join(paths.dist, "..") }
        ]),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'config.json'), to: path.join(paths.dist, "..") }
        ]),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'new.json'), to: path.join(paths.dist, "..") }
        ]),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'localConfig.json'), to: path.join(paths.dist, "..", "MapStore2", "web", "client") }
        ]),
        new CopyWebpackPlugin([
            { from: path.join(paths.framework, 'pluginsConfig.json'), to: path.join(paths.dist, "..") }
        ])
    ],
    {
        "@mapstore": path.resolve(__dirname, "..", "..", "web", "client"),
        "@js": path.resolve(__dirname, "..", "..", "..", "js")
    }
);
