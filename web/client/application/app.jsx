/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const ReactDOM = require('react-dom');

const {Provider} = require('react-redux');
const MapStore = require('./containers/MapStore');
const Debug = require('../components/development/Debug');

const store = require('./stores/store');

var {loadMapConfig} = require('../actions/config');
var {changeBrowserProperties} = require('../actions/browser');
var {loadLocale} = require('../actions/locale');
var {configurePlugins} = require('./actions/plugins');

var ConfigUtils = require('../utils/ConfigUtils');
var LocaleUtils = require('../utils/LocaleUtils');

store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

ConfigUtils
    .loadConfiguration()                       // localConfig.json: Global configuration
    .then(() => ConfigUtils.loadPlugins())     // plugins.json: Global list of dynamically loaded plugins
    .then((plugins) => {
        store.dispatch(configurePlugins(plugins));
    })
    .then(() => {                              // config.json: app configuration
        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));
    });

ReactDOM.render(
    <Provider store={store}>
        <div>
            <MapStore/>
            <Debug/>
        </div>
    </Provider>
    , document.getElementById("container")
);
