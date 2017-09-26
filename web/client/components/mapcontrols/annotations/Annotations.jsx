/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const ConfirmDialog = require('../../misc/ConfirmDialog');
const Message = require('../../I18N/Message');
const {Glyphicon, Button, ButtonGroup} = require('react-bootstrap');
const {head} = require('lodash');

/**
 * Annotations panel component. Currently handles the removal confirm panel.
 * We will add the annotations cards UI.
 * @memberof components.mapControls.annotations
 * @class
 * @prop {boolean} editing flag that means we are currently in editing mode
 * @prop {object} removing object to remove, it is also a flag that means we are currently asking for removing an annotation / geometry. Toggles visibility of the confirm dialog
 * @prop {function} onCancelRemove triggered when the user cancels removal
 * @prop {function} onConfirmRemove triggered when the user confirms removal
 *
 */
class Annotations extends React.Component {
    static propTypes = {
        editing: PropTypes.object,
        removing: PropTypes.object,
        onCancelRemove: PropTypes.func,
        onConfirmRemove: PropTypes.func,
        onAdd: PropTypes.func,
        onHighlight: PropTypes.func,
        onCleanHighlight: PropTypes.func,
        onDetail: PropTypes.func,
        mode: PropTypes.string,
        editor: PropTypes.func,
        annotations: PropTypes.array,
        fields: PropTypes.array,
        current: PropTypes.string
    };

    static defaultProps = {
        mode: 'list',
        fields: [
            {
                name: 'title',
                type: 'text',
                validator: (val) => val,
                validateError: 'annotations.mandatory',
                showLabel: false,
                editable: true
            },
            {
                name: 'description',
                type: 'html',
                showLabel: true,
                editable: true
            }
        ]
    };

    renderFieldValue = (field, annotation) => {
        const fieldValue = annotation.properties[field.name] || '';
        switch (field.type) {
            case 'html':
                return <span dangerouslySetInnerHTML={{__html: fieldValue} }/>;
            default:
                return fieldValue;
        }
    };

    renderField = (field, annotation) => {
        return (<div className={"mapstore-annotations-panel-card-" + field.name}>
            {this.renderFieldValue(field, annotation)}
        </div>);
    };

    renderCard = (annotation) => {
        return (<div className="mapstore-annotations-panel-card" onMouseOver={() => this.props.onHighlight(annotation.properties.id)} onMouseOut={this.props.onCleanHighlight} onClick={() => this.props.onDetail(annotation.properties.id)}>
            <span className="mapstore-annotations-panel-card-thumbnail"/>{this.props.fields.map(f => this.renderField(f, annotation))}
        </div>);
    };

    renderCards = () => {
        if (this.props.mode === 'list') {
            return [<ButtonGroup id="mapstore-annotations-panel-buttons">
                <Button bsStyle="primary" onClick={this.props.onAdd}><Glyphicon glyph="plus"/>&nbsp;<Message msgId="annotations.add"/></Button>
            </ButtonGroup>,
            <div className="mapstore-annotations-panel-cards">{this.props.annotations.map(a => this.renderCard(a))}</div>
            ];
        }
        const Editor = this.props.editor;
        if (this.props.mode === 'detail') {
            const annotation = head(this.props.annotations.filter(a => a.properties.id === this.props.current));
            return <Editor showBack id={this.props.current} {...annotation.properties}/>;
        }
        // new annotation
        return this.props.editing && <Editor id={this.props.editing.properties.id} {...this.props.editing.properties}/>;
    };

    render() {
        if (this.props.removing) {
            return (<ConfirmDialog
                show
                modal
                onClose={this.props.onCancelRemove}
                onConfirm={() => this.props.onConfirmRemove(this.props.removing)}
                confirmButtonBSStyle="default"
                closeGlyph="1-close"
                confirmButtonContent={<Message msgId="annotations.confirm" />}
                closeText={<Message msgId="annotations.cancel" />}>
                <Message msgId={this.props.mode === 'editing' ? "annotations.removegeometry" : "annotations.removeannotation"}/>
                </ConfirmDialog>);
        }
        return (<div className="mapstore-annotations-panel">
            {this.renderCards()}
        </div>);
    }
}

module.exports = Annotations;
