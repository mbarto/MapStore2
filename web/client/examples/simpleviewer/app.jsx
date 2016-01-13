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
const Viewer = require('./containers/Viewer');
const Debug = require('../../components/development/Debug');

const store = require('./stores/viewerstore');

var {loadMapConfig} = require('../../actions/config');
var {changeBrowserProperties} = require('../../actions/browser');
var {loadLocale} = require('../../actions/locale');
var {configurePlugins} = require('../../actions/plugins');

var ConfigUtils = require('../../utils/ConfigUtils');
var LocaleUtils = require('../../utils/LocaleUtils');

store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

ConfigUtils.loadConfiguration()
.then(() => ConfigUtils.loadPlugins())
.then((plugins) => {
    store.dispatch(configurePlugins('examples/simpleviewer/plugins/', plugins));
})
.then(() => {
    const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
    store.dispatch(loadMapConfig(configUrl, legacy));

    let locale = LocaleUtils.getUserLocale();
    store.dispatch(loadLocale('../../translations', locale));
});

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Viewer/>
            <Debug/>
        </div>
    </Provider>
    , document.getElementById("container")
);
