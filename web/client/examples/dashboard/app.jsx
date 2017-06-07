const React = require('react');
const ReactDOM = require('react-dom');

const Provider = require('react-redux').Provider;

// include application component
const Dashboard = require('./containers/Dashboard');
const url = require('url');

const loadMapConfig = require('../../actions/config').loadMapConfig;
const ConfigUtils = require('../../utils/ConfigUtils');

const {plugins} = require('./plugins');

// initializes Redux store
const store = require('../../stores/StandardStore')({}, {}, {}, plugins, {});

// reads parameter(s) from the url
const urlQuery = url.parse(window.location.href, true).query;

// get configuration file url (defaults to config.json on the app folder)
const { configUrl, legacy } = ConfigUtils.getConfigurationOptions(urlQuery, 'config', 'json');

// dispatch an action to load the configuration from the config.json file
store.dispatch(loadMapConfig(configUrl, legacy));


// Renders the application, wrapped by the Redux Provider to connect the store to components
ReactDOM.render(
    <Provider store={store}>
        <Dashboard plugins={plugins}/>
    </Provider>,
    document.getElementById('container')
);
