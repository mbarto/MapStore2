/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');

const LayerTree = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        layers: React.PropTypes.array,
        filter: React.PropTypes.func
    },
    getDefaultProps() {
        return {
                id: 'mapstore-layertree',
                layers: [],
                filter: () => { return true; }
        };
    },
    render() {
        let groups = ['Default'];
        let layersByGroup = {
            'Default': []
        };
        let filtered = this.props.layers.filter((item) => {
            return this.props.filter(item);
        });
        filtered.reduce((previous, item) => {
            let group = item.group || 'Default';
            if (groups.indexOf(group) === -1) {
                groups.push(item.group);
                layersByGroup[group] = [];
            }
            layersByGroup[group].push(item);
        });
        const nodes = groups.map((group) => {
            const groupNodes = layersByGroup[group].map((layer) => {
                return <li key={layer.name}><input type="checkbox" checked={layer.visibility}/>{layer.name} - {layer.type}</li>;
            });
            return (
                <li className="layertree-group" key={group}>{group}
                    <ul>
                        {groupNodes}
                    </ul>
                </li>
            );
        });
        return (
            <ul id={this.props.id}>
                {nodes}
            </ul>
        );
    }
});

module.exports = LayerTree;
