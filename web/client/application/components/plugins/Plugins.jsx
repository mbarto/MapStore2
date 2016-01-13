/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Plugin = require('./Plugin');

const {connect} = require('react-redux');

const Plugins = (props) => (
    <div>
        {props.plugins.map((plugin) => <Plugin key={plugin.id || plugin.type} {...plugin}/>)}
    </div>
);

module.exports = connect((state) => {
    return {
        plugins: state.config && state.config.plugins || state.plugins || []
    };
})(Plugins);
