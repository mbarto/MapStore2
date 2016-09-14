/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const ReactDOM = require('react-dom');

const {Provider} = require('react-redux');

const store = require('./stores/store');

const Mosaic = require('./containers/Mosaic');

const MosaicApp = React.createClass({
    render() {
        return (
        <Provider store={store}>
            <Mosaic/>
        </Provider>);
    }
});


ReactDOM.render(<MosaicApp/>, document.getElementById('container'));
