import React, { useState, useEffect } from "react";

import { connect, actions, selectors } from 'mapstore-redux';

export default ({Layer, Map}) => {
    const Comp = (props) => {
        return (
            <>
                <Map {...props} zoomControl={false}>
                    <Layer type="osm" />
                </Map>
            </>);
    };
    return connect(selectors.map.mapSelector, {
        onMapViewChanges: actions.map.changeMapView
    })(Comp);
}
