/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');
const Debug = require('../../../components/development/Debug');
const Mosaic = connect((state) => {
    return {
        tiles: state.mosaic.tiles || []
    };
})(require('../components/Mosaic'));

const MosaicContainer = React.createClass({
    propTypes: {
        tiles: React.PropTypes.array
    },
    getDefaultProps() {
        return {
            tiles: []
        };
    },
    render() {
        return (<div className="fill">
            <Mosaic/>
            <Debug/>
        </div>);
    }

});
module.exports = MosaicContainer;
