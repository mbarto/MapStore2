import React from 'react';
import ReactDOM from 'react-dom';

import {Layer, Map} from 'mapstore-leaflet';

ReactDOM.render((<Map>
    <Layer type="osm"/>
</Map>), document.getElementById('container'));
