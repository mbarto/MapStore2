/*
EXAMPLE1
*/
const React = require('react');
const ReactDOM = require('react-dom');
const MapStoreMap = require('../../components/map/leaflet/Map');
const MapStoreLayer = require('../../components/map/leaflet/Layer');
require('../../components/map/leaflet/plugins');

ReactDOM.render((<MapStoreMap>
    <MapStoreLayer type="osm"/>
</MapStoreMap>), document.getElementById('container'));


/*
EXAMPLE2

const React = require('react');
const ReactDOM = require('react-dom');
const assign = require('object-assign');
const mystore = require('../../stores/StandardStore')({
    defaultState: {
        layers: {
            flat: [{
                id: "wms",
                visibility: true
            }]
        }
    }
});
const {Provider, connect} = require('react-redux');
const MapStoreMap = require('../../components/map/leaflet/Map');
const MapStoreLayer = require('../../components/map/leaflet/Layer');
const Checkbox = connect((state) => ({
    checked: state.layers.flat[0].visibility
}))(require('react-bootstrap').Checkbox);

const {changeLayerProperties} = require('../../actions/layers');

const ControlledLayer = connect((state, ownProps) => ({
    options: assign({}, ownProps.options, {
        visibility: state.layers.flat[0].visibility
    })
}))(MapStoreLayer);

require('../../components/map/leaflet/plugins');
ReactDOM.render((
<Provider store={mystore}>
<div>
<MapStoreMap>
    <MapStoreLayer type="osm"/>
    <ControlledLayer type="wms" options={{
        url: "https://demo.geo-solutions.it/geoserver/wms",
        name: "nurc:Arc_Sample",
        opacity: 0.5
}}/>
</MapStoreMap>
<Checkbox onChange={(evt) => {
    mystore.dispatch(changeLayerProperties('wms', {visibility: evt.target.checked}));
}}>Toggle</Checkbox>
</div>
</Provider>
), document.getElementById('container'));
*/

/*
EXAMPLE3

const React = require('react');
const ReactDOM = require('react-dom');
const PluginsUtils = require('../../utils/PluginsUtils');
const Theme = require('../../components/theme/Theme');

const plugins = require('./plugins').plugins;

const mystore = require('../../stores/StandardStore')({
    defaultState: {
        map: {
            center: {x: 10, y: 45, crs: "EPSG:4326"},
            zoom: 5
        },
        layers: {
            flat: [{
                type: "osm"
            }, {
                type: "wms",
                url: "https://demo.geo-solutions.it/geoserver/wms",
                name: "nurc:Arc_Sample",
                opacity: 0.5
            }]
        }
    }
}, {}, {}, plugins);

const { Provider } = require('react-redux');
const pluginsConfig = {
    main: [{
        name: 'Map',
        cfg: {
            zoomControl: true
        }
    }, 'Toolbar', 'ZoomIn']
};


const PluginsContainer = require('../../components/plugins/PluginsContainer');
ReactDOM.render((
    <Provider store={mystore}>
            <Theme version="my" path="../../dist/themes">
                <PluginsContainer mode="main" pluginsConfig={pluginsConfig} plugins={PluginsUtils.getPlugins(plugins)}/>
            </Theme>
    </Provider>), document.getElementById("container"));
*/

/*
EXAMPLE4
const React = require('react');
const ReactDOM = require('react-dom');
const plugins = require('./plugins');

const initialState = {
    defaultState: {
        map: {
            center: {x: 10, y: 45, crs: "EPSG:4326"},
            zoom: 5
        },
        layers: {
            flat: [{
                type: "osm"
            }, {
                id: "wms",
                type: "wms",
                url: "https://demo.geo-solutions.it/geoserver/wms",
                name: "nurc:Arc_Sample",
                opacity: 0.5,
                visibility: true
            }]
        }
    }
};

const mystore = require('../../stores/StandardStore').bind(null, initialState, {}, {
});

const StandardApp = require('../../components/app/StandardApp');
const StandardAppComponent = require('../../components/app/StandardAppComponent');

const pluginsConfig = {
    desktop: ['Map', 'Toolbar', 'ZoomIn', 'ZoomOut', 'My']
};

ReactDOM.render(
    <StandardApp appComponent={StandardAppComponent} themeCfg={{path: "../../dist/themes"}} version="my"
        appStore={mystore} pluginsConfig={pluginsConfig} pluginsDef={plugins} mode="desktop"/>
, document.getElementById("container"));
*/
/**
 * EXAMPLE 5
 *

const React = require('react');
const ReactDOM = require('react-dom');
const Rx = require('rxjs');
const plugins = require('./plugins');
const {CHANGE_LAYER_PROPERTIES, changeLayerProperties} = require('../../actions/layers');

const initialState = {
    defaultState: {
        map: {
            center: {x: 10, y: 45, crs: "EPSG:4326"},
            zoom: 2
        },
        layers: {
            flat: [{
                type: "osm"
            }, {
                id: "wms",
                type: "wms",
                url: "https://demo.geo-solutions.it/geoserver/wms",
                name: "nurc:Arc_Sample",
                opacity: 0.5,
                visibility: true
            }, {
                id: "wms2",
                type: "wms",
                url: "https://demo.geo-solutions.it/geoserver/wms",
                name: "topp:states",
                opacity: 0.5,
                visibility: true
            }]
        }
    }
};

const mystore = require('../../stores/StandardStore').bind(null, initialState, {}, {
    myepic: (action$) =>
        action$.ofType(CHANGE_LAYER_PROPERTIES)
        .switchMap((action) => {
            if (action.layer === 'wms') {
                return Rx.Observable.of(changeLayerProperties('wms2', {
                    visibility: action.newProperties.visibility
                }));
            }
            return Rx.Observable.empty();
        })
});

const StandardApp = require('../../components/app/StandardApp');
const StandardAppComponent = require('../../components/app/StandardAppComponent');

const pluginsConfig = {
    desktop: ['Map', 'Toolbar', 'ZoomIn', 'ZoomOut', 'My']
};

ReactDOM.render(
    <StandardApp appComponent={StandardAppComponent} themeCfg={{path: "../../dist/themes"}} version="my"
        appStore={mystore} pluginsConfig={pluginsConfig} pluginsDef={plugins} mode="desktop"/>
, document.getElementById("container"));
 */
/**
 * EXAMPLE 6
require('../../product/main')({
    themeCfg: {
        path: "../../dist/themes"
    },
    pages: [{
        name: "home",
        path: "/",
        component: require('../../product/pages/MapViewer')
    }]
}, require('./plugins'));
*/
