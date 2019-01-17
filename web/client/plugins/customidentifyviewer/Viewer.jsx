const React = require('react');
const PropTypes = require('prop-types');
const axios = require('../../libs/ajax');
const Template = require('./Template');

class Viewer extends React.Component {
    static propTypes = {
        response: PropTypes.object,
        layer: PropTypes.object
    }

    state = {
        template: null,
        loading: false
    };
    componentWillMount() {
        const templateName = this.props.layer.featureInfo.featureTemplate;
        this.setState({
            loading: true
        });
        axios.get("templates/" + templateName + '.jsxt').then((resp) => {
            this.setState({
                template: resp.data,
                loading: false
            });
        });
    }
    render() {
        if (this.state.template) {
            return (<Template template={this.state.template} model={{
                features: this.props.response.features
            }}/>);
        }
        return <div>Loading...</div>;
    }
}

module.exports = Viewer;
