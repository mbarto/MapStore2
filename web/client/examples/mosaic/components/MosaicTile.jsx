require('../assets/css/skin-home.css');

const React = require('react');
const MosaicTile = React.createClass({
    propTypes: {
        icon: React.PropTypes.string,
        name: React.PropTypes.string,
        objectNumber: React.PropTypes.number,
        tematicViewNumber: React.PropTypes.number,
        setData: React.PropTypes.func
    },

    render() {

        const boxStyle = {
              backgroundImage: this.props.icon,
              backgroundColor: '#0000FF',
              width: '300px',
              height: '300px',
              border: '1px solid #000000',
              zIndex: '1000'
        };

        return (
            <div id="boxinfo" style={boxStyle} >
                <ul className="list-group categorie">
                            <li className="boxinfo">
                              {this.props.name}
                              <div className="ogg_appl" onClick={this.updateVal}>
                                <span>
                                 <a href="#" className="list-group-item">
                                   Oggetti {this.props.objectNumber} + {this.props.icon}
                                 </a>
                                </span>
                                <span>
                                  <a href="#" className="list-group-item">
                                   Viste tematiche {this.props.tematicViewNumber}
                                  </a>
                                </span>
                              </div>
                            </li>
                </ul>
            </div>
        );
    }

});

module.exports = MosaicTile;
