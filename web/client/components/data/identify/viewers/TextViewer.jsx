import PropTypes from 'prop-types';

/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

class TextViewer extends React.Component {
    static propTypes = {
        response: PropTypes.string
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.response !== this.props.response;
    }

    render() {
        return <pre>{this.props.response}</pre>;
    }
}

export default TextViewer;
