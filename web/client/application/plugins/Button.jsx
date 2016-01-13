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

const {Button} = require('react-bootstrap');

const ButtonPlugin = (props, context) => {
    let {text, actions, ...other} = props;
    actions = bindActionCreators(Object.keys(actions || {}).reduce((previous, action) => {
        let actionPath = actions[action];
        let actionName = actionPath.substring(actionPath.lastIndexOf('/') + 1);
        actionPath = actionPath.substring(0, actionPath.lastIndexOf('/'));
        previous[action] = require("../../actions/" + actionPath)[actionName];
        return previous;
    }, {}), context.store.dispatch);
    return <Button {...other} {...actions}>{text}</Button>;
};

ButtonPlugin.contextTypes = {
    store: React.PropTypes.object
};

module.exports = connect(() => ({}))(ButtonPlugin);
