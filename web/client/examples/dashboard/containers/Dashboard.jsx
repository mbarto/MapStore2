const React = require('react');
const connect = require('react-redux').connect;

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');

const _ = require('lodash');

const widthProvider = require('react-grid-layout').WidthProvider;
const ResponsiveReactGridLayout = widthProvider(require('react-grid-layout').Responsive);

const PluginsContainer = connect((state) => ({
    pluginsState: state && state.controls || {}
}))(require('../../../components/plugins/PluginsContainer'));

const PluginsUtils = require('../../../utils/PluginsUtils');

const Theme = require('../../../components/theme/Theme');

class Dashboard extends React.Component {
    static propTypes = {
        // redux store slice with map configuration (bound through connect to store at the end of the file)
        mapConfig: React.PropTypes.object,
        // redux store dispatch func
        dispatch: React.PropTypes.func,
        onLayoutChange: React.PropTypes.func,
        plugins: React.PropTypes.object
    };

    static defaultProps = {
        onLayoutChange: () => {},
        className: "layout",
        cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
        rowHeight: 100,
        plugins: {}
    };

    state = {
        items: [0, 1, 2, 3, 4].map(function(i, key, list) {
            return {
                i: i.toString(),
                x: i * 2,
                y: 0,
                w: 2,
                h: 2,
                add: i === (list.length - 1).toString(),
                plugin: null,
                configuring: false
            };
        }),
        newCounter: 0
    };

    pluginOption = (i, plugin) => {
        const pluginName = plugin.substring(0, plugin.length - 6);
        return <option key={i + pluginName}>{pluginName}</option>;
    };

    selectPlugin = (i, evt) => {
        const item = this.state.items[parseInt(i, 10)];
        item.plugin = evt.target.value;
        this.setState({items: this.state.items});
    };

    toggleConfigure = (i) => {
        const item = this.state.items[parseInt(i, 10)];
        item.configuring = !item.configuring;
        this.setState({items: this.state.items});
    };

    renderPlugin = (i, el) => {
        if (el.plugin && !el.configuring) {
            return (<PluginsContainer style={{zIndex: 0, top: "20px", position: "absolute", width: "100%", bottom: "20px"}} plugins={PluginsUtils.getPlugins(this.props.plugins)} pluginsConfig={{
                    standard: [el.plugin]
                }} mode="standard"/>);
        } else if (el.plugin) {
            return <span className="text">Configure your plugin!</span>;
        }
        return <span className="text">{i}</span>;
    };

    createElement = (el) => {
        var removeStyle = {
          position: 'absolute',
          right: '2px',
          top: 0,
          cursor: 'pointer'
        };
        var i = el.add ? '+' : el.i;
        return (
          <div key={i} data-grid={el}>
            {this.renderPlugin(i, el)}
            <select style={{zIndex: 1, position: "absolute", top: 0, left: 0}} value={this.state.items[parseInt(i, 10)].plugin || "---"} onChange={this.selectPlugin.bind(this, i)}>
                <option>----</option>
                {Object.keys(this.props.plugins).map(this.pluginOption.bind(this, i))}
            </select>
            {this.state.items[parseInt(i, 10)].plugin ? <button style={{position: "absolute", top: 0, right: "50px"}} onClick={this.toggleConfigure.bind(this, i)}>{this.state.items[parseInt(i, 10)].configuring ? "Preview" : "Configure"}</button> : null}
            <span className="remove" style={removeStyle} onClick={this.onRemoveItem.bind(this, i)}>x</span>
          </div>
        );
    };

    onAddItem = () => {
        /*eslint no-console: 0*/
        console.log('adding', 'n' + this.state.newCounter);
        this.setState({
          // Add a new item. It must have a unique key!
          items: this.state.items.concat({
            i: 'n' + this.state.newCounter,
            x: this.state.items.length * 2 % (this.state.cols || 12),
            y: Infinity, // puts it at the bottom
            w: 2,
            h: 2
          }),
          // Increment the counter to ensure key is always unique.
          newCounter: this.state.newCounter + 1
        });
    };

    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange = (breakpoint, cols) => {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    };

    onLayoutChange = (layout) => {
        this.props.onLayoutChange(layout);
        this.setState({layout: layout});
    };

    onRemoveItem = (i) => {
        console.log('removing', i);
        this.setState({items: _.reject(this.state.items, {i: i})});
    };

    render() {
        return (
          <div>
            <Theme path="../../../dist/themes"/>
            <button onClick={this.onAddItem}>Add Item</button>
            <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}
                {...this.props}>
                {this.state.items.map(this.createElement)}
            </ResponsiveReactGridLayout>
          </div>
        );
    }
}


// connect Redux store slice with map configuration
module.exports = connect((state) => {
    return {
        mapConfig: state.mapConfig
    };
})(Dashboard);
