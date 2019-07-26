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

    const ConfigUtils = require('../../utils/ConfigUtils');
    const LocaleUtils = require('../../utils/LocaleUtils');
    const PluginsUtils = require('../../utils/PluginsUtils');

    const { changeBrowserProperties } = require('../../actions/browser');
    const { loadMapConfig } = require('../../actions/config');
    const { loadLocale } = require('../../actions/locale');
    const { searchTextChanged, textSearch } = require('../../actions/search');
    const { loadPrintCapabilities } = require('../../actions/print');
    const { plugins } = require('./plugins');

    const annyang = require('annyang');

    const stringSimilarity = require('string-similarity');

    const Localized = connect((state) => ({
        messages: state.locale && state.locale.messages,
        locale: state.locale && state.locale.current,
        loadingError: state.locale && state.locale.localeError
    }))(require('../../components/I18N/Localized'));


    const assign = require('object-assign');
    const appCfg = {
        customReducers: assign({}, require('../../reducers/mapimport')),
        currentStyle: require('!!raw-loader!./theme.less')
    };

    const customReducer = (state = {}, action) => {
        if (appCfg.customReducers) {
            const newState = assign({}, state);
            Object.keys(appCfg.customReducers).forEach((stateKey) => {
                assign(newState, { [stateKey]: appCfg.customReducers[stateKey](state[stateKey], action) });
            });
            return newState;
        }
        return state;
    };

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

    const SpeechEnabled = class extends React.Component {
        componentDidMount() {
            const pluginNames = Object.keys(plugins).map(p => p.substring(0, p.length - 6));

            var commands = {
                'add *plugin': (plugin) => {
                    checkFile({name: stringSimilarity.findBestMatch(plugin.replace(/[^a-zA-Z]/g, ''), pluginNames).bestMatch.target + 'Plugin'});
                },
                'search *place': (place) => {
                    store.dispatch(searchTextChanged(place));
                    store.dispatch(textSearch(place));
                }
            };
            annyang.setLanguage('en-US');
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
                            <Theme path="../../dist/themes" version="dropit"/>
                            <PluginsContainer params={{ mapType: "openlayers" }} plugins={PluginsUtils.getPlugins(getPlugins())} pluginsConfig={getPluginsConfiguration()} mode="standard" />
                            <div className="dropzone-content"><div className="dropzone-text">Drop it here!</div>
                            </div>
                        </Dropzone>
                        </SpeechEnabled>
                    </Localized>
                </Provider>
            ,
            document.getElementById("container"));
    };

    assign(appCfg, {
        store,
        plugins,
        pluginsCfg,
        userPlugins,
        React
    });

    const fileHandlers = [
        require('./drophandlers/plugin')(appCfg),
        require('./drophandlers/style')(appCfg),
        require('./drophandlers/data')(appCfg),
        require('./drophandlers/url')(appCfg),
        require('./drophandlers/annotations')(appCfg)
    ];

    const checkContent = (text, type, evt) => {
        Promise.all(fileHandlers.map((handler) => handler.canHandleText(text, type))).then((handlers) => {
            const result = handlers.reduce((previous, current) => {
                return current.priority > previous.priority ? current : previous;
            }, {
                    handler: null,
                    priority: -1
                });
            if (result.handler) {
                result.handler.handleText(text, renderPage, type, evt);
            }
        }).catch(e => {
        });
    };

    const checkFile = (file, evt) => {
        Promise.all(fileHandlers.map((handler) => handler.canHandle(file))).then((handlers) => {
            const result = handlers.reduce((previous, current) => {
                return current.priority > previous.priority ? current : previous;
            }, {
                    handler: null,
                    priority: -1
                });
            if (result.handler) {
                result.handler.handle(file, renderPage, evt);
            }
        }).catch(e => {
        });
    };

    const checkFiles = (files, otherContent, e) => {
        const evt = {
            x: e.clientX,
            y: e.clientY
        };
        files.forEach(file => {
            checkFile(file, evt);
            window.URL.revokeObjectURL(file.preview);
        });
        otherContent.forEach(content => {
            const {type} = content;
            content.getAsString(text => checkContent(text, type, evt));
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
