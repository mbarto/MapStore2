/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DebugUtils = require('../../utils/DebugUtils');
const {combineReducers} = require('redux');
const pluginsReducer = require('../reducers/plugins');
const assign = require('object-assign');

const defaultReducers = combineReducers({
    browser: require('../../reducers/browser'),
    config: require('../../reducers/config'),
    locale: require('../../reducers/locale'),
    plugins: () => ([]),
    application: () => ({})
});

let pluginsReducers;
let plugins;

const rootReducer = (state = {}, action) => {
    if (!pluginsReducers) {
        plugins = pluginsReducer([], action);
        if (plugins.length > 0) {
            pluginsReducers = plugins.reduce((reducers, plugin) => {
                return assign(reducers, {...plugin.configuration.reducers});
            }, {});
            pluginsReducers = combineReducers(pluginsReducers);
        }
    }
    if (pluginsReducers) {
        return {
            ...defaultReducers(state, action),
            plugins: plugins,
            application: {
                ...pluginsReducers(state.application, action)
            }
        };
    }
    return {
        ...defaultReducers(state, action)
    };
};

const store = DebugUtils.createDebugStore(rootReducer, {});

module.exports = store;
