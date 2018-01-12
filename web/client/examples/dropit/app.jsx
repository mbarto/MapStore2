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

    const { changeBrowserProperties } = require('../../actions/browser');
    const { loadMapConfig } = require('../../actions/config');
    const { loadLocale } = require('../../actions/locale');
    const { loadPrintCapabilities } = require('../../actions/print');
    const { addLayer } = require('../../actions/layers');
    const { zoomToExtent } = require('../../actions/map');

    const { plugins } = require('./plugins');
    const { endsWith } = require('lodash');

    const Localized = connect((state) => ({
        messages: state.locale && state.locale.messages,
        locale: state.locale && state.locale.current,
        loadingError: state.locale && state.locale.localeError
    }))(require('../../components/I18N/Localized'));


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
        standard: ['Toolbar']
    };

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

    const renderPage = () => {
        ReactDOM.render(

                <Provider store={store}>
                    <Localized>
                        <Dropzone className="dropzone" onClick={(e) => {
                            e.preventDefault();
                        }} onDrop={checkFiles}>
                            <Theme path="../../dist/themes" />
                            <PluginsContainer params={{ mapType }} plugins={PluginsUtils.getPlugins(getPlugins())} pluginsConfig={getPluginsConfiguration()} mode="standard" />
                            <div className="dropzone-content"><div className="dropzone-text">Drop it here!</div>
                            </div>
                        </Dropzone>
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

    const fileHandlers = [{
        name: 'Plugin',
        canHandle(file) {
            return endsWith(file.name.split('.')[0], "Plugin") ? 10 : -1;
        },
        canHandleText(text) {
            try {
                const compiled = Babel.transform(text, { presets: ['es2015', 'react', 'stage-0'] });
                return compiled.code ? 10 : -1;
            } catch(e) {
                // TODO
            }
            return -1;
        },
        handle(file) {
            const fileName = file.name.split('.')[0];
            const pluginName = fileName.substring(0, fileName.length - 6);

            if (plugins[fileName]) {
                pluginsCfg.standard.push(pluginName);
                renderPage();
            } else {
                FileUtils.readText(file)
                    .then((code) => {
                        customPlugin(code, (plugin) => {
                            userPlugins[fileName] = { [fileName]: plugin };
                            pluginsCfg.standard.push(pluginName);
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
                renderPage();
            });
        }
    }, {
        name: 'Data',
        canHandle(file) {
            return file.type === 'application/x-zip-compressed' ||
                file.type === 'application/zip' ? 10 : -1;
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
            });
        },
        canHandleText: () => false
    }];

    const checkContent = (text) => {
        const result = fileHandlers.reduce((previous, current) => {
            return current.canHandleText(text) > previous.priority ? {
                handler: current,
                priority: current.canHandleText(text)
            } : previous;
        }, {
                handler: null,
                priority: -1
            });
        if (result.handler) {
            result.handler.handleText(text);
        }
    };

    const checkFile = (file) => {
        const result = fileHandlers.reduce((previous, current) => {
            return current.canHandle(file) > previous.priority ? {
                handler: current,
                priority: current.canHandle(file)
            } : previous;
        }, {
                handler: null,
                priority: -1
            });
        if (result.handler) {
            result.handler.handle(file);
        }
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
