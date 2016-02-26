/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var ReactDOM = require('react-dom');

var {Provider} = require('react-redux');

var {loadMapConfig} = require('../../actions/config');
var {changeBrowserProperties} = require('../../actions/browser');
var {loadLocale} = require('../../actions/locale');

var ConfigUtils = require('../../utils/ConfigUtils');
var LocaleUtils = require('../../utils/LocaleUtils');

var Proj4js = require('proj4');

var Debug = require('../../components/development/Debug');

function startApp(plugins) {
    let store = require('./stores/viewerstore')(plugins.reducers);
    let Viewer = require('./containers/Viewer')(plugins.actions);

    /**
    * Detect Browser's properties and save in app state.
    **/
    store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

    ConfigUtils.loadConfiguration().then(() => {
        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));
    });


    ReactDOM.render(
        <Provider store={store}>
            <div className="fill">
                <Viewer plugins={plugins.components} mapParams={{
                    overview: true,
                    scaleBar: true,
                    zoomControl: true
                }}/>
                <Debug/>
            </div>
        </Provider>,
        document.getElementById('container')
    );

}

Proj4js.defs("EPSG:502017", "+proj=laea +lat_0=90 +lon_0=50.0 +x_0=0.0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");

if (!global.Intl ) {
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js', './plugins'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/it.js');
        let plugins = require('./plugins');
        startApp(plugins);
    });
}else {
    require.ensure(["./plugins"], (require) => {
        var plugins = require('./plugins');
        startApp(plugins);
    });
}
