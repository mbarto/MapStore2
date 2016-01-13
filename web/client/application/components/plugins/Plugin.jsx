/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const Plugin = React.createClass({
    propTypes: {
        type: React.PropTypes.string
    },
    componentWillMount() {
        this.implementation = require('../../plugins/' + this.props.type);
    },
    render() {
        if (this.implementation) {
            const {type, children, ...other} = this.props;
            return <this.implementation {...other}/>;
        }
    }
});

module.exports = Plugin;
