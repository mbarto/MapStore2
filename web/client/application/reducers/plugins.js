/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {CONFIGURE_PLUGINS} = require('../actions/plugins');
const assign = require('object-assign');

module.exports = (state = [], action) => {
    switch (action.type) {
        case CONFIGURE_PLUGINS: {
            return action.plugins.map((plugin) => {
                return assign({}, plugin, {
                    configuration: {
                        reducers: require('../plugins/' + plugin.type).reducers
                    }
                });
            });
        }
        default:
            return state;
    }
};
