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

class Annotations extends React.Component {
    static propTypes = {
        removing: PropTypes.string,
        onCancelRemove: PropTypes.func,
        onConfirmRemove: PropTypes.func
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
                <Message msgId="annotations.removemessage"/>
                </ConfirmDialog>);
        }
        return null;
    }
}

module.exports = Annotations;
