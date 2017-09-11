/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const {connect} = require('../utils/PluginsUtils');
const assign = require('object-assign');
const Message = require('../components/I18N/Message');

const {Glyphicon} = require('react-bootstrap');
const {toggleControl} = require('../actions/controls');

/**
  * Annotations Plugin. Implements annotations handling on maps.
  *
  * @class Annotations
  * @memberof plugins
  * @static
  */
const AnnotationsPlugin = connect()(require('../components/mapcontrols/annotations/Annotations'));
const {addAnnotationsLayer} = require('../epics/annotations');

module.exports = {
    AnnotationsPlugin: assign(AnnotationsPlugin, {
        BurgerMenu: {
            name: 'annotations',
            position: 2000,
            text: <Message msgId="annotationsbutton"/>,
            icon: <Glyphicon glyph="comment"/>,
            action: toggleControl.bind(null, 'annotations', null),
            priority: 2,
            doNotHide: true
        }
    }),
    reducers: {},
    epics: {
        addAnnotationsLayer
    }
};
