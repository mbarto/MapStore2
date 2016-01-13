/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CONFIGURE_PLUGINS = 'CONFIGURE_PLUGINS';

const configurePlugins = (plugins) => ({
    type: CONFIGURE_PLUGINS,
    plugins
});

module.exports = {CONFIGURE_PLUGINS, configurePlugins};
