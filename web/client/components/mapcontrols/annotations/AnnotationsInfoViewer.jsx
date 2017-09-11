const PropTypes = require('prop-types');
/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {isString} = require('lodash');

const alwaysExcluded = ["id", "exclude", "titleStyle", "listStyle", "componentStyle", "title"];

const {Button, Glyphicon} = require('react-bootstrap');

const Message = require('../../I18N/Message');

class AnnotationsInfoViewer extends React.Component {
    static displayName = 'PropertiesViewer';

    static propTypes = {
        title: PropTypes.string,
        id: PropTypes.string,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func
    };

    getBodyItems = () => {
        return Object.keys(this.props)
            .filter(this.toExclude)
            .map((key) => {
                return (
                    <p key={key} className="mapstore-annotations-info-viewer-item"><b>{key}</b> {this.renderProperty(this.props[key])}</p>
                );
            });
    };

    renderHeader = () => {
        if (!this.props.title) {
            return null;
        }
        return (
            <div key={this.props.title} className="mapstore-annotations-info-viewer-title">
                {this.props.title}
            </div>
        );
    };

    renderBody = () => {
        var items = this.getBodyItems();
        if (items.length === 0) {
            return null;
        }
        return (
            <div className="mapstore-annotations-info-viewer-items">
                {items}
            </div>
        );
    };

    renderButtons = () => {
        return (<div className="mapstore-annotations-info-viewer-buttons">
            <Button bsStyle="primary" onClick={() => this.props.onEdit(this.props.id)}><Glyphicon glyph="pencil"/>&nbsp;<Message msgId="annotations.edit"/></Button>
            <Button bsStyle="primary" onClick={() => this.props.onRemove(this.props.id)}><Glyphicon glyph="ban-circle"/>&nbsp;<Message msgId="annotations.remove"/></Button>
        </div>);
    };

    renderProperty = (prop) => {
        if (isString(prop)) {
            return prop;
        }
        return JSON.stringify(prop);
    };
    render() {
        return (
            <div className="mapstore-annotations-info-viewer">
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderButtons()}
            </div>
        );
    }

    toExclude = (propName) => {
        return alwaysExcluded
            .indexOf(propName) === -1;
    };
}

module.exports = AnnotationsInfoViewer;
