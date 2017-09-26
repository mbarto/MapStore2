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
const PropTypes = require('prop-types');

const {Glyphicon} = require('react-bootstrap');
const {toggleControl} = require('../actions/controls');
const {head} = require('lodash');

const {cancelRemoveAnnotation, confirmRemoveAnnotation, editAnnotation, newAnnotation, removeAnnotation, cancelEditAnnotation,
    saveAnnotation, toggleAdd, validationError, removeAnnotationGeometry, toggleStyle, setStyle, restoreStyle,
    highlight, cleanHighlight, showAnnotation, cancelShowAnnotation} =
    require('../actions/annotations');

const AnnotationsEditor = connect((state) => ({
    fields: state.annotations && state.annotations.fields,
    editing: state.annotations && state.annotations.editing,
    drawing: state.annotations && !!state.annotations.drawing,
    styling: state.annotations && !!state.annotations.styling,
    errors: state.annotations.validationErrors
}),
{
    onEdit: editAnnotation,
    onCancelEdit: cancelEditAnnotation,
    onCancel: cancelShowAnnotation,
    onError: validationError,
    onSave: saveAnnotation,
    onRemove: removeAnnotation,
    onAddGeometry: toggleAdd,
    onStyleGeometry: toggleStyle,
    onCancelStyle: restoreStyle,
    onSaveStyle: toggleStyle,
    onSetStyle: setStyle,
    onDeleteGeometry: removeAnnotationGeometry
})(require('../components/mapcontrols/annotations/AnnotationsEditor'));

const AnnotationsInfoViewer = connect((state) => ({
    fields: state.annotations && state.annotations.fields,
    editing: state.annotations && state.annotations.editing,
    drawing: state.annotations && !!state.annotations.drawing,
    styling: state.annotations && !!state.annotations.styling,
    errors: state.annotations.validationErrors
}),
{
    onEdit: editAnnotation,
    onCancelEdit: cancelEditAnnotation,
    onError: validationError,
    onSave: saveAnnotation,
    onRemove: removeAnnotation,
    onAddGeometry: toggleAdd,
    onStyleGeometry: toggleStyle,
    onCancelStyle: restoreStyle,
    onSaveStyle: toggleStyle,
    onSetStyle: setStyle,
    onDeleteGeometry: removeAnnotationGeometry
})(require('../components/mapcontrols/annotations/AnnotationsEditor'));

const Annotations = connect((state) => ({
    removing: state.annotations && state.annotations.removing,
    mode: state.annotations && state.annotations.editing && 'editing' || (state.annotations && state.annotations.current && 'detail' || 'list'),
    editor: AnnotationsEditor,
    fields: state.annotations && state.annotations.fields,
    annotations: state.layers && state.layers.flat && head(state.layers.flat.filter(l => l.id === 'annotations')) && head(state.layers.flat.filter(l => l.id === 'annotations')).features || [],
    current: state.annotations && state.annotations.current || null,
    editing: state.annotations && state.annotations.editing
}), {
    onCancelRemove: cancelRemoveAnnotation,
    onConfirmRemove: confirmRemoveAnnotation,
    onAdd: newAnnotation,
    onHighlight: highlight,
    onCleanHighlight: cleanHighlight,
    onDetail: showAnnotation
})(require('../components/mapcontrols/annotations/Annotations'));

const {Panel} = require('react-bootstrap');
const ContainerDimensions = require('react-container-dimensions').default;
const Dock = require('react-dock').default;

class AnnotationsPanel extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        active: PropTypes.bool,
        wrap: PropTypes.bool,
        wrapWithPanel: PropTypes.bool,
        panelStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        toggleControl: PropTypes.func,
        closeGlyph: PropTypes.string,
        buttonStyle: PropTypes.object,
        style: PropTypes.object,
        dockProps: PropTypes.object,

        // side panel properties
        width: PropTypes.number
    };

    static defaultProps = {
        id: "mapstore-annotations-panel",
        active: false,
        wrap: false,
        modal: true,
        wrapWithPanel: false,
        panelStyle: {
            zIndex: 100,
            overflow: "hidden",
            height: "100%"
        },
        panelClassName: "catalog-panel",
        toggleControl: () => {},
        closeGlyph: "1-close",

        // side panel properties
        width: 660,
        dockProps: {
            dimMode: "none",
            size: 0.30,
            fluid: true,
            position: "right",
            zIndex: 1030
        }
    };

    render() {
        const panel = <Annotations {...this.props}/>;
        const panelHeader = (<span><Glyphicon glyph="comment"/> <span className="annotations-panel-title"><Message msgId="annotations.title"/></span><button onClick={this.props.toggleControl} className="annotations-close close">{this.props.closeGlyph ? <Glyphicon glyph={this.props.closeGlyph} /> : <span>×</span>}</button></span>);
        return this.props.active ? (
            <ContainerDimensions>
            { ({ width }) =>
                <Dock {...this.props.dockProps} isVisible={this.props.active} size={this.props.width / width > 1 ? 1 : this.props.width / width} >
                    <Panel id={this.props.id} header={panelHeader}
                        style={this.props.panelStyle} className={this.props.panelClassName}>
                            {panel}
                        </Panel>
                </Dock>}
            </ContainerDimensions>
        ) : null;
    }
}

/**
  * Annotations Plugin. Implements annotations handling on maps.
  * Adds:
  *  - a new vector layer, with id 'annotations', to show user created annotations on the map
  *  - a new menu in the BurgerMenu to handle current annotations (still to be implemented)
  *  - a custom template for Identify applied to annotations geometries that also allows editing {@link components.mapControls.annotations.AnnotationsInfoViewer}
  *  - styling of the annotation
  * Annotations are geometries (currently only markers are supported) with a set of properties. By default a title and
  * a description are managed, but you can configure a different set of fields, using initialState in localConfig.json:
  * @example
  * {
  *   ...
  *   "initialState": {
  *     "defaultState": {
  *         "annotations": {
  *             "fields": [{
  *                 "name": "myattribute",
  *                 "editable": true
  *                 "validator": "value.indexOf('fake') === -1",
  *                 "validateError": "annotations.error.fake"
  *             }]
  *         }
  *     }
  *   }
  * }
  *
  * @class Annotations
  * @memberof plugins
  * @static
  */
const AnnotationsPlugin = connect((state) => ({
    active: state.controls && state.controls.annotations && state.controls.annotations.enabled || false
}), {
    toggleControl: toggleControl.bind(null, 'annotations', null)
})(AnnotationsPanel);

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
    reducers: {
        annotations: require('../reducers/annotations')
    },
    epics: require('../epics/annotations')(AnnotationsInfoViewer)
};
