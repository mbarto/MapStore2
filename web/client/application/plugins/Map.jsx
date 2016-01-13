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

const urlQuery = require('url').parse(window.location.href, true).query;

const {changeMousePosition} = require('../../actions/mousePosition');
const {changeMapView} = require('../../actions/map');

const MapPlugin = (props) => {
    const mapType = urlQuery.type || props.mapType;
    const WMap = require('../../components/map/' + mapType + '/Map');
    const Layer = require('../../components/map/' + mapType + '/Layer');
    require('../../components/map/' + mapType + '/plugins/index');
    return props.map ?
        (<WMap {...props.map} {...props.actions}>
            {props.layers.map((layer, index) =>
                <Layer key={layer.name} position={index} type={layer.type}
                    options={assign({}, layer, {srs: props.map.propjection})}/>
            )}
        </WMap>) : <span/>;
};

MapPlugin.propTypes = {
    mapType: React.PropTypes.string
};

MapPlugin.defaultProps = {
    mapType: 'leaflet'
};

MapPlugin.reducers = {
    mousePosition: require('../../reducers/mousePosition'),
    map: require('../../reducers/map')
};

module.exports = connect((state) => {
    return {
        map: (state.application && state.application.map) || (state.config && state.config.map),
        layers: state.config && state.config.layers || []
    };
}, dispatch => {
    return {
        actions: bindActionCreators({
            onMouseMove: changeMousePosition,
            onMapViewChanges: changeMapView
        }, dispatch)
    };
})(MapPlugin);
