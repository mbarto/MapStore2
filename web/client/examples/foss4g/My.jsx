const React = require('react');
const PropTypes = require('prop-types');
const {Checkbox} = require('react-bootstrap');

const {connect} = require('react-redux');

const { changeLayerProperties } = require('../../actions/layers');

class MyComponent extends React.Component {
    static propTypes = {
        onToggle: PropTypes.func,
        layer: PropTypes.string
    };

    static defaultProps = {
        status: false,
        onToggle: () => {},
        layer: {}
    };
    render() {
        return this.props.layer ? <Checkbox style={{position: "absolute", right: "10px", bottom: "150px", zIndex: 1000}} checked={this.props.layer.visibility} onChange={this.toggle}/> : null;
    }

    toggle = (evt) => {
        this.props.onToggle(this.props.layer.id, {visibility: evt.target.checked});
    };
}

const MyPlugin = connect((state) => ({
    layer: state.layers.flat[1]
}), {
        onToggle: changeLayerProperties
})(MyComponent);

module.exports = {
    MyPlugin
};
