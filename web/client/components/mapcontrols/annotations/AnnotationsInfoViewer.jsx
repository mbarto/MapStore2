const PropTypes = require('prop-types');
/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const {Button, Glyphicon} = require('react-bootstrap');
const TButton = require('../../data/featuregrid/toolbars/TButton');

const Message = require('../../I18N/Message');

const {FormControl, ButtonGroup, Grid, Row, Col} = require('react-bootstrap');

const ReactQuill = require('react-quill');
require('react-quill/dist/quill.snow.css');

const {isFunction} = require('lodash');

const assign = require('object-assign');

const PluginsUtils = require('../../../utils/PluginsUtils');

class AnnotationsInfoViewer extends React.Component {
    static displayName = 'AnnotationsInfoViewer';

    static propTypes = {
        title: PropTypes.string,
        id: PropTypes.string,
        onEdit: PropTypes.func,
        onCancelEdit: PropTypes.func,
        onRemove: PropTypes.func,
        onSave: PropTypes.func,
        onError: PropTypes.func,
        onAddGeometry: PropTypes.func,
        onEditGeometry: PropTypes.func,
        onDeleteGeometry: PropTypes.func,
        onStyleGeometry: PropTypes.func,
        fields: PropTypes.array,
        editing: PropTypes.object,
        drawing: PropTypes.bool,
        errors: PropTypes.object
    };

    static defaultProps = {
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
                showLabel: false,
                editable: true
            }
        ]
    };

    state = {
        editedFields: {}
    };

    componentWillReceiveProps(newProps) {
        if (newProps.id !== this.props.id) {
            this.setState({
                editedFields: {}
            });
        }
    }

    getBodyItems = (editing) => {
        return this.props.fields
            .filter((field) => !editing || field.editable)
            .map((field) => {
                const isError = editing && this.props.errors[field.name];
                const additionalCls = isError ? 'field-error' : '';
                return (
                    <span><p key={field.name} className={"mapstore-annotations-info-viewer-item mapstore-annotations-info-viewer-" + field.name + ' ' + additionalCls}>
                        {field.showLabel ? <b><Message msgId={"annotations.field." + field.name}/></b> : null} {this.renderProperty(field, this.props[field.name], editing)}
                    </p>
                    {isError ? this.renderErrorOn(field.name) : ''}
                    </span>
                );
            });
    };

    getValidator = (validator) => {
        if (isFunction(validator)) {
            return validator;
        }
        return PluginsUtils.handleExpression({}, {}, '{(function(value) {return ' + validator + ';})}');
    };

    renderViewButtons = () => {
        return (<ButtonGroup id="mapstore-annotations-info-viewer-buttons">
                <Button bsStyle="primary" onClick={() => this.props.onEdit(this.props.id)}><Glyphicon glyph="pencil"/>&nbsp;<Message msgId="annotations.edit"/></Button>
                <Button bsStyle="primary" onClick={() => this.props.onRemove(this.props.id)}><Glyphicon glyph="ban-circle"/>&nbsp;<Message msgId="annotations.remove"/></Button>
            </ButtonGroup>);
    };

    renderEditingButtons = () => {
        return (<Grid fluid>
                    <Row>
                        <Col xs={7}>
                            <TButton
                                id="edit-geometry"
                                tooltip={<Message msgId="annotations.addMarker"/>}
                                onClick={this.props.onAddGeometry}
                                visible
                                active={this.props.drawing}
                                glyph="pencil-add"/>
                            <TButton
                                id="style-annotation-geometry"
                                tooltip={<Message msgId="annotations.styleGeometry"/>}
                                onClick={this.props.onStyleGeometry}
                                visible
                                glyph="1-stilo"/>
                            <TButton
                                id="delete-annotation-geometry"
                                tooltip={<Message msgId="annotations.deleteGeometry"/>}
                                onClick={this.props.onDeleteGeometry}
                                visible
                                glyph="trash"/>
                        </Col>
                        <Col xs={5}>
                            <Button bsStyle="primary" onClick={this.save}><Glyphicon glyph="floppy-disk"/>&nbsp;<Message msgId="annotations.save"/></Button>
                            <Button bsStyle="primary" onClick={this.cancelEdit}><Glyphicon glyph="remove"/>&nbsp;<Message msgId="annotations.cancel"/></Button>
                        </Col>
            </Row>
        </Grid>);
    };

    renderButtons = (editing) => {
        return editing ? this.renderEditingButtons() : this.renderViewButtons();
    };

    renderProperty = (field, prop, editing) => {
        const fieldValue = this.state.editedFields[field.name] === undefined ? prop : this.state.editedFields[field.name];
        if (editing) {
            switch (field.type) {
                case 'html':
                    return <ReactQuill value={fieldValue} onChange={(val) => this.change(field.name, val)}/>;
                default:
                    return <FormControl value={fieldValue} onChange={(e) => this.change(field.name, e.target.value)}/>;
            }

        }
        switch (field.type) {
            case 'html':
                return <span dangerouslySetInnerHTML={{__html: fieldValue} }/>;
            default:
                return fieldValue;
        }
    };

    renderErrorOn = (field) => {
        return <div className="annotations-edit-error"><Message msgId={this.props.errors[field]}/></div>;
    };

    renderBody = (editing) => {
        var items = this.getBodyItems(editing);
        if (items.length === 0) {
            return null;
        }
        return (
            <div className="mapstore-annotations-info-viewer-items">
                {items}
            </div>
        );
    };

    renderError = (editing) => {
        return editing ? Object.keys(this.props.errors).filter(field => this.props.fields.filter(f => f.name === field).length === 0).map(field => this.renderErrorOn(field)) : null;
    };

    render() {
        const editing = this.props.editing && (this.props.editing.properties.id === this.props.id);
        return (
            <div className="mapstore-annotations-info-viewer">
                {this.renderBody(editing)}
                {this.renderError(editing)}
                {this.renderButtons(editing)}
            </div>
        );
    }

    cancelEdit = () => {
        this.setState({
            editedFields: {}
        });
        this.props.onCancelEdit();
    };

    change = (field, value) => {
        this.setState({
            editedFields: assign({}, this.state.editedFields, {
                [field]: value
            })
        });
    };

    validate = () => {
        return assign(this.props.fields.filter(field => field.editable).reduce((previous, field) => {
            const value = this.state.editedFields[field.name] === undefined ? this.props[field.name] : this.state.editedFields[field.name];
            if (field.validator && !this.getValidator(field.validator)(value)) {
                return assign(previous, {
                    [field.name]: field.validateError
                });
            }
            return previous;
        }, {}), this.props.editing.geometry ? {} : {
            geometry: 'annotations.emptygeometry'
        });

    };

    save = () => {
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            this.props.onSave(this.props.id, assign({}, this.state.editedFields), this.props.editing.geometry);
        } else {
            this.props.onError(errors);
        }
    };
}

module.exports = AnnotationsInfoViewer;
