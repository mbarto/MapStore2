/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');

const MousePosition = require('../../components/mapcontrols/mouseposition/MousePosition');

const MousePositionPlugin = (props) => (
    props.mousePosition && props.crs ?
        (<MousePosition {...props}/>) : <span/>
);

MousePositionPlugin.reducers = {};

module.exports = connect((state) => {
    return {
        mousePosition: state.application && state.application.mousePosition && state.application.mousePosition.position,
        crs: state.application && state.application.map && state.application.map.projection,
        enabled: state.application && state.application.mousePosition && state.application.mousePosition.enabled || false
    };
})(MousePositionPlugin);
