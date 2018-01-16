/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const startApp = () => {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const {connect} = require('react-redux');
    const uuid = require('uuid');

    const ConfigUtils = require('../../utils/ConfigUtils');
    const LocaleUtils = require('../../utils/LocaleUtils');
    const PluginsUtils = require('../../utils/PluginsUtils');
    const FileUtils = require('../../utils/FileUtils');
    const LayersUtils = require('../../utils/LayersUtils');
    const ThemeUtils = require('../../utils/ThemeUtils');

    const { changeBrowserProperties } = require('../../actions/browser');
    const { loadMapConfig } = require('../../actions/config');
    const { loadLocale } = require('../../actions/locale');
    const { loadPrintCapabilities } = require('../../actions/print');
    const { addLayer } = require('../../actions/layers');
    const { zoomToExtent } = require('../../actions/map');

    const { plugins } = require('./plugins');
    const { endsWith, capitalize } = require('lodash');

    const annyang = require('annyang');

    const Localized = connect((state) => ({
        messages: state.locale && state.locale.messages,
        locale: state.locale && state.locale.current,
        loadingError: state.locale && state.locale.localeError
    }))(require('../../components/I18N/Localized'));


    const {success, warning, error} = require('../../actions/notifications');

    const defaultStyle = require('raw-loader!../../themes/default/theme.less');

    const assign = require('object-assign');
    let customReducers = assign({}, require('../../reducers/shapefile'));

    const context = require('./context');

    const Babel = require('babel-standalone');

    const customReducer = (state = {}, action) => {
        if (customReducers) {
            const newState = assign({}, state);
            Object.keys(customReducers).forEach((stateKey) => {
                assign(newState, { [stateKey]: customReducers[stateKey](state[stateKey], action) });
            });
            return newState;
        }
        return state;
    };

    const Template = require('../../components/data/template/jsx/Template');

    const store = require('./store')(plugins, customReducer);

    const Dropzone = require('react-dropzone');

    const pluginsCfg = {
        standard: ['Notifications']
    };

    const {Promise} = require('es6-promise');

    const Theme = connect((state) => ({
        theme: state.theme && state.theme.selectedTheme && state.theme.selectedTheme.id || 'default'
    }))(require('../../components/theme/Theme'));

    const { Provider } = require('react-redux');

    const PluginsContainer = connect((state) => ({
        pluginsState: state && state.controls || {}
    }))(require('../../components/plugins/PluginsContainer'));

    const userPlugins = {};

    const getPlugins = () => {
        return assign({}, plugins, userPlugins);
    };

    const getPluginsConfiguration = () => {
        return {
            standard: pluginsCfg.standard.map((plugin) => ({
                name: plugin,
                cfg: {}
            }))
        };
    };

    let mapType = "leaflet";

    const StyleUtils = require('../../utils/StyleUtils')(mapType);

    const SpeechEnabled = class extends React.Component {
        componentDidMount() {
            var commands = {
                'add :plugin': (plugin) => { 
                    checkFile({name: capitalize(plugin) + 'Plugin'});
                }
            };

            // Add our commands to annyang
            annyang.addCommands(commands);
            annyang.debug(true);
            // Start listening.
            annyang.start();
        }

        render() {
            return this.props.children;
        }
    };

    const renderPage = () => {
        ReactDOM.render(

                <Provider store={store}>
                    <Localized>
                    <SpeechEnabled>
                        <Dropzone className="dropzone" onClick={(e) => {
                            e.preventDefault();
                        }} onDrop={checkFiles}>
                            <Theme path="../../dist/themes" />
                            <PluginsContainer params={{ mapType }} plugins={PluginsUtils.getPlugins(getPlugins())} pluginsConfig={getPluginsConfiguration()} mode="standard" />
                            <div className="dropzone-content"><div className="dropzone-text">Drop it here!</div>
                            </div>
                        </Dropzone>
                        </SpeechEnabled>
                    </Localized>
                </Provider>
            ,
            document.getElementById("container"));
    };

    const customPlugin = (code, callback) => {
        /*eslint-disable */
        const require = context;
        try {
            customReducers = assign({}, customReducers, eval(Babel.transform(code, { presets: ['es2015', 'react', 'stage-0'] }).code).reducers || null);

            /*eslint-enable */
            const plugin = connect(() => ({
                template: code,
                renderContent: (comp) => {
                    /*eslint-disable */
                    return eval(comp).Plugin;
                    /*eslint-enable */
                },
                getReducers() {
                    return this.comp;
                }
            }), {
                    onError: () => { }
            })(Template);

            callback(plugin);
        } catch (e) {
            // TODO
        }
    };

    const replaceTheme = (style) => {
        return defaultStyle + '\n' + style;
    };

    const fileHandlers = [{
        name: 'Plugin',
        canHandle(file) {
            return new Promise((resolve) => {
                resolve({
                    handler: this,
                    priority: endsWith(file.name.split('.')[0], "Plugin") ? 10 : -1
                });
            });
        },
        canHandleText(text) {
            return new Promise((resolve) => {
                try {
                    const compiled = Babel.transform(text, { presets: ['es2015', 'react', 'stage-0'] });
                    resolve({
                        handler: this,
                        priority: compiled.code ? 10 : -1
                    });
                } catch(e) {
                    // TODO
                }
                resolve({
                    handler: this,
                    priority: -1
                });
            });
        },
        handle(file) {
            const fileName = file.name.split('.')[0];
            const pluginName = fileName.substring(0, fileName.length - 6);

            if (plugins[fileName]) {
                pluginsCfg.standard.push(pluginName);
                store.dispatch(success({
                    title: 'Added new Plugin',
                    message: pluginName + ' Plugin added to the page!'
                }));
                renderPage();
            } else {
                FileUtils.readText(file)
                    .then((code) => {
                        customPlugin(code, (plugin) => {
                            userPlugins[fileName] = { [fileName]: plugin };
                            pluginsCfg.standard.push(pluginName);
                            store.dispatch(success({
                                title: 'Added new Plugin',
                                message: pluginName + ' Plugin added to the page!'
                            }));
                            renderPage();
                        });
                    });
            }
        },
        handleText(code) {
            customPlugin(code, (plugin) => {
                const pluginName = plugin.pluginName || uuid.v1();
                const fileName = pluginName + 'Plugin';
                userPlugins[fileName] = { [fileName]: plugin };
                pluginsCfg.standard.push(pluginName);
                store.dispatch(success({
                    title: 'Added new Plugin',
                    message: pluginName + ' Plugin added to the page (Custom user plugin)!'
                }));
                renderPage();
            });
        }
    }, {
            name: 'Style',
            canHandle(file) {
                return new Promise((resolve) => {
                    resolve({
                        handler: this,
                        priority: endsWith(file.name.toLowerCase(), '.less') || endsWith(file.name.toLowerCase(), '.css') ? 10 : -1
                    });
                });
            },
            canHandleText(text) {
                return new Promise((resolve) => {
                    ThemeUtils.compileFromLess(text, 'themes/default/', (css, e) => {
                        if (e) {
                            resolve({
                                handler: this,
                                priority: -1
                            });
                        }
                        resolve({
                            handler: this,
                            priority: 10
                        });
                    });
                });
            },
            handle(file) {
                FileUtils.readText(file)
                    .then((style) => {

                        ThemeUtils.compileFromLess(style, 'themes/default/', (css) => {
                            if (style.indexOf('@ms2-') !== -1) {
                                store.dispatch(success({
                                    title: 'Changed Theme',
                                    message: 'Page Theme replaced'
                                }));
                                document.getElementById('custom_theme').innerText = css;
                            } else {
                                const styleEl = document.createElement("style");
                                document.head.appendChild(styleEl);
                                styleEl.innerText = css;
                                store.dispatch(success({
                                    title: 'CSS updated',
                                    message: 'New CSS applied to the page!'
                                }));
                            }
                        });
                    });
            },
            handleText(styleText) {
                const style = (styleText.indexOf('@ms2-') !== -1 && styleText.indexOf('@import') !== -1) ? styleText : replaceTheme(styleText);
                ThemeUtils.compileFromLess(style, 'themes/default/', (css) => {
                    if (style.indexOf('@ms2-') !== -1) {
                        store.dispatch(success({
                            title: 'Changed Theme',
                            message: 'Page Theme replaced!'
                        }));
                        document.getElementById('custom_theme').innerText = css;
                    } else {
                        const styleEl = document.createElement("style");
                        document.head.appendChild(styleEl);
                        styleEl.innerText = css;
                        store.dispatch(success({
                            title: 'CSS updated',
                            message: 'New CSS applied to the page!'
                        }));
                    }
                });
            }
        }, {
            name: 'Data',
            canHandle(file) {
                return new Promise((resolve) => {
                    resolve({
                        handler: this,
                        priority: file.type === 'application/x-zip-compressed' ||
                        file.type === 'application/zip' ? 10 : -1
                    });
                });
            },
            handle(file) {
                FileUtils.readBuffer(file).then(buffer => {
                    const geoJson = FileUtils.shpToGeoJSON(buffer);
                    const layer = geoJson.map((l) => {
                        return LayersUtils.geoJSONToLayer(l, uuid.v1());
                    });
                    const styledLayer = StyleUtils.toVectorStyle(layer[0], {
                        radius: 5,
                        color: {
                            a: 1,
                            r: 0,
                            g: 0,
                            b: 255
                        },
                        width: 1,
                        opacity: 1,
                        fill: {
                            a: 0.7,
                            r: 0,
                            g: 0,
                            b: 255
                        }
                    });
                    store.dispatch(addLayer(styledLayer));
                    store.dispatch(zoomToExtent(styledLayer.bbox.bounds, styledLayer.bbox.crs));
                    store.dispatch(success({
                        title: 'New Data',
                        message: 'Shapefile added to the page!'
                    }));
                });
            },
            canHandleText: () => {
                return new Promise((resolve) => {
                    resolve({
                        handler: this,
                        priority: -1
                    });
                });
            }
        }
    ];

    const checkContent = (text) => {
        Promise.all(fileHandlers.map((handler) => handler.canHandleText(text))).then((handlers) => {
            const result = handlers.reduce((previous, current) => {
                return current.priority > previous.priority ? current : previous;
            }, {
                    handler: null,
                    priority: -1
                });
            if (result.handler) {
                result.handler.handleText(text);
            }
        });
    };

    const checkFile = (file) => {
        Promise.all(fileHandlers.map((handler) => handler.canHandle(file))).then((handlers) => {
            const result = handlers.reduce((previous, current) => {
                return current.priority > previous.priority ? current : previous;
            }, {
                    handler: null,
                    priority: -1
                });
            if (result.handler) {
                result.handler.handle(file);
            }
        });
    };

    const checkFiles = (files, otherContent) => {
        files.forEach(file => {
            checkFile(file);
        });
        otherContent.forEach(content => {
            content.getAsString(text => checkContent(text));
        });
    };

    ConfigUtils.loadConfiguration().then(() => {
        store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));

        store.dispatch(loadPrintCapabilities(ConfigUtils.getConfigProp('printUrl')));

        renderPage();
    });
};

if (!global.Intl ) {
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/it.js');
        startApp();
    });
} else {
    startApp();
}
