import React from 'react';
import Plugins, {PluginsContainer} from 'mapstore-plugins';
import { withStore } from 'mapstore-redux';
import map from '../../web/client/reducers/map';
import layers from '../../web/client/reducers/layers';

export default withStore(() => {
    return (<PluginsContainer mode="demo" plugins={Plugins.getPlugins(Plugins.plugins)} pluginsConfig={{
        demo: ["Map"]
    }}/>);
}, {
    map: {
        center: {
            x: 13,
            y: 45,
            crs: 'EPSG:4326'
        },
        zoom: 5
    },
    layers: {
        flat: [
            {
                type: 'osm'
            }
        ]
    }
}, Object.assign(Plugins.getReducers(Plugins.plugins), {map, layers}));
