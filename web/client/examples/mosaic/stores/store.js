/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var DebugUtils = require('../../../utils/DebugUtils');

const {combineReducers} = require('redux');

const rootReducer = combineReducers({
    mosaic: require('../reducers/mosaic')
});

module.exports = DebugUtils.createDebugStore(rootReducer, {});
