/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {bindActionCreators} = require('redux');

const assign = require('object-assign');


const WMap = require('../../../components/map/leaflet/Map');
const Layer = require('../../../components/map/leaflet/Layer');

const {changeMousePosition} = require('../../../actions/mousePosition');

const MapPlugin = (props) => (
    props.map ?
        (<WMap {...props.map} {...props.actions}>
            {props.layers.map((layer, index) =>
                <Layer key={layer.name} position={index} type={layer.type}
                    options={assign({}, layer, {srs: props.map.propjection})}/>
            )}
        </WMap>) : <span/>
);

module.exports = connect((state) => {
    return {
        map: state.config && state.config.map,
        layers: state.config && state.config.layers || []
    };
}, dispatch => {
    return {
        actions: bindActionCreators({
            onMouseMove: changeMousePosition
        }, dispatch)
    };
})(MapPlugin);

require('../../../components/map/leaflet/plugins/OSMLayer');
