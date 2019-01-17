const React = require('react');
const PropTypes = require('prop-types');
const Template = require('../../components/data/template/jsx/Template');
const {FormControl, Button} = require('react-bootstrap');
const assign = require('object-assign');

class TemplateCustom extends React.Component {
    static propTypes = {
        model: PropTypes.object
    };

    state = {
        model: {}
    };

    componentWillMount() {
        this.setState({
            model: this.props.model
        });
    }
    render() {
        const {model, ...other} = this.props;
        return <Template model={this.state.model} {...other} renderContent={this.customRender} />;
    }
    customRender = (comp) => {
        /* eslint-disable */
        let model = this.state.model;
        let actions = {
            onChange: (idx, key, value) => {
                this.setState({
                    model: assign({}, model, {
                        features: this.state.model.features.map((f, i) => {
                            return i === idx ? assign({}, f, {
                                properties: assign({}, f.properties, {
                                    [key]: value
                                })
                            }): f;
                        })
                    })
                });
            },
            onSubmit: () => {
                console.log(this.state.model);
            }
        };
        return eval(comp);
        /* eslint-enable */
    };
}
module.exports = TemplateCustom;
