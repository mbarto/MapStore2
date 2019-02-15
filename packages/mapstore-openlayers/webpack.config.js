const DefinePlugin = require("webpack/lib/DefinePlugin");
const NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");
const NoEmitOnErrorsPlugin = require("webpack/lib/NoEmitOnErrorsPlugin");
const path = require('path');
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

module.exports = {
    entry: {
        "mapstore-leaflet": path.join(__dirname, "index")
    },
    optimization: {
        splitChunks: {
			cacheGroups: {
                vendor: {
					test: /node_modules/,
					chunks: "initial",
					name: "vendor",
					priority: 10,
					enforce: true
				}
            }
        }
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist",
        filename: "[name].js",
        chunkFilename: "[name].[hash].chunk.js"
    },
    plugins: [
        new DefinePlugin({
            "__DEVTOOLS__": false
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new NormalModuleReplacementPlugin(/leaflet$/, path.join(__dirname, "..", "..", "web", "client", "libs", "leaflet")),
        new NoEmitOnErrorsPlugin(),
        new ParallelUglifyPlugin({
            uglifyJS: {
                sourceMap: false,
                compress: { warnings: false },
                mangle: true
            }
    })],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        noParse: [/html2canvas/],
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }]
            },
            {
                test: /\.less$/,
                exclude: /themes[\\\/]?.+\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }]
            },
            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        mimetype: "application/font-woff"
                    }
                }]
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: "[name].[ext]"
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: "[path][name].[ext]",
                        limit: 8192
                    }
                }] // inline base64 URLs for <=8k images, direct URLs for the rest
            },
            {
                test: /\.jsx$/,
                exclude: /(ol\.js)$|(Cesium\.js)$/,
                use: [{
                    loader: "react-hot-loader"
                }]
            }, {
                test: /\.jsx?$/,
                exclude: /(ol\.js)$|(Cesium\.js)$/,
                use: [{
                    loader: "babel-loader",
                    options: { babelrcRoots: ['.', '../../web/client'] }
                }]
            }
        ]
    },
    devServer: {
        proxy: {
            '/rest/geostore': {
                target: "https://dev.mapstore.geo-solutions.it/mapstore",
                secure: false,
                headers: {
                    host: "dev.mapstore.geo-solutions.it"
                }
            },
            '/pdf': {
                target: "https://dev.mapstore.geo-solutions.it/mapstore",
                secure: false,
                headers: {
                    host: "dev.mapstore.geo-solutions.it"
                }
            },
            '/mapstore/pdf': {
                target: "https://dev.mapstore.geo-solutions.it",
                secure: false,
                headers: {
                    host: "dev.mapstore.geo-solutions.it"
                }
            },
            '/proxy': {
                target: "https://dev.mapstore.geo-solutions.it/mapstore",
                secure: false,
                headers: {
                    host: "dev.mapstore.geo-solutions.it"
                }
            },
            '/docs': {
                target: "http://localhost:8081",
                pathRewrite: { '/docs': '/mapstore/docs' }
            }
        }
    }
};

/*const path = require("path");
const assign = require('object-assign');
const extractThemesPlugin = require('../../themes.js').extractThemesPlugin;

const paths = {
    base: path.join(__dirname),
    dist: path.join(__dirname, "dist"),
    framework: path.join(__dirname, "..", "..", "web", "client"),
    code: path.join(__dirname, "..", "..", "web", "client")
};

module.exports = require('../../buildConfig')(
    assign({
        "mapstore-leaflet": path.join(__dirname, "index")
    }),
    {},
    paths,
    extractThemesPlugin,
    true,
    "/mapstore/dist/",
    undefined,
    []
);*/
