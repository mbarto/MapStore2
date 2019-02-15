import React, {lazy, useState, Suspense, useRef} from 'react';
import ReactDOM from 'react-dom';
const Leaflet = lazy(() => import('./Leaflet'));
const OpenLayers = lazy(() => import('./OpenLayers'));

import {actions, selectors, withStore, connect} from 'mapstore-redux';
import Plugins, {PluginsContainer} from 'mapstore-plugins';

const AppComponent = ({ onZoom, zoom }) => {
    const [mapType, setMapType] = useState('');
    const mapTypeSelector = useRef(null);
    return (<>
        <span>Zoom: {zoom}</span>
        <select value={mapType} ref={mapTypeSelector} onChange={() => setMapType(mapTypeSelector.current.value)}>
            <option value="">----</option>
            <option value="leaflet">Leaflet</option>
            <option value="openlayers">OpenLayers</option>
        </select>
        <button onClick={() => onZoom(zoom + 1)}>Zoom+</button>
        <button onClick={() => onZoom(zoom - 1)}>Zoom-</button>
        {mapType === 'leaflet' ? <Suspense fallback={<div>Loading...</div>}><Leaflet /></Suspense> : null}
        {mapType === 'openlayers' ? <Suspense fallback={<div>Loading...</div>}><OpenLayers /></Suspense> : null}
    </>);
};

const App = withStore(connect(selectors.map.mapSelector, {
    onZoom: actions.map.changeZoomLevel
})(AppComponent));

ReactDOM.render((<App/>), document.getElementById('container'));
