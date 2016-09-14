const React = require('react');
const Tile = require('./MosaicTile');

/*
const INIT_VAL =
[
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
           tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
           name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        },
        {
            name: "ddddddddddd",
            icon: "url(assets/application/conoscenze_ambientali/css/images/aria.png)",
            tematicViewNumber: 2,
            objectNumber: 3
        }
];
*/
const Mosaic = React.createClass({
    propTypes: {
        tiles: React.PropTypes.array
    },
    getDefaultProps() {
        return {
            tiles: []
        };
    },

    renderTiles() {
        return this.props.tiles.map(function(tile) {
            return (<Tile
                        setData {...tile}
                    />);
        });
    },
    render() {
        return (

                <div className="container blocchetti">
                    <div className="row">
                    <ul className="list-group categorie">
                        {this.renderTiles()}
                    </ul>
                  </div>
                </div>
        );
    }


});

module.exports = Mosaic;
