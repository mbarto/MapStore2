/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
const React = require('react');
const {connect} = require('react-redux');
const PropTypes = require('prop-types');
const Debug = require('../development/Debug');
const {Route} = require('react-router');
const {ConnectedRouter} = require('connected-react-router');
const history = require('../../stores/History').default;

const Localized = require('../I18N/Localized');

const assign = require('object-assign');

const {getReducers, getEpics} = require("../../utils/PluginsUtils");
const {augmentStore} = require("../../utils/StateUtils");

const Theme = connect((state) => ({
    theme: state.theme && state.theme.selectedTheme && state.theme.selectedTheme.id
}), {}, (stateProps, dispatchProps, ownProps) => {
    return assign({}, stateProps, dispatchProps, ownProps);
})(require('../theme/Theme'));

const {getPlugins} = require('../../utils/PluginsUtils');

class DynamicPage extends React.Component {
    static propTypes = {
        pageLoader: PropTypes.func
    };

    state = {
        page: null,
        plugins: null
    };

    componentDidMount() {
        const { pageLoader } = this.props;
        pageLoader((page, plugins) => {
            const reducers = getReducers(plugins.plugins);
            const epics = getEpics(plugins.plugins);
            augmentStore({ reducers, epics });
            this.setState({
                page,
                plugins
            });
        });
    }

    render() {
        const { pageLoader, plugins, ...other} = this.props;
        const { plugins: statePlugins } = this.state.plugins || {};
        const pagePlugins = statePlugins ? { ...plugins, ...getPlugins(statePlugins)} : plugins;
        const Page = this.state.page;
        return Page && <Page {...other} plugins={pagePlugins}/>;
    }
}

class StandardRouter extends React.Component {
    static propTypes = {
        plugins: PropTypes.object,
        locale: PropTypes.object,
        pages: PropTypes.array,
        className: PropTypes.string,
        themeCfg: PropTypes.object,
        version: PropTypes.string,
        loadAfterTheme: PropTypes.bool
    };

    static defaultProps = {
        plugins: {},
        locale: {messages: {}, current: 'en-US'},
        pages: [],
        className: "fill",
        themeCfg: {
            path: 'dist/themes'
        },
        loadAfterTheme: false
    };
    state = {
        themeLoaded: false,
        pages: []
    }
    componentDidMount() {
        this.setState({
            pages: this.props.pages.map((page) => {
                const pageConfig = page.pageConfig || {};
                return {...page, component: connect(() => ({
                    plugins: this.props.plugins,
                    pageLoader: page.component,
                    ...pageConfig
                }))(DynamicPage)};
            })
        });
    }
    renderPages = () => {
        return this.state.pages.map((page, i) => <Route key={(page.name || page.path) + i} exact path={page.path} component={page.component} />);
    };

    renderAfterTheme() {
        return (
            <div className={this.props.className}>
                <Theme {...this.props.themeCfg} version={this.props.version} onLoad={this.themeLoaded}>
                    {this.state.themeLoaded ? (<Localized messages={this.props.locale.messages} locale={this.props.locale.current} loadingError={this.props.locale.localeError}>
                        <ConnectedRouter history={history}>
                            <div>
                                {this.renderPages()}
                            </div>
                        </ConnectedRouter>
                    </Localized>) :
                        (<span><div className="_ms2_init_spinner _ms2_init_center"><div></div></div>
                            <div className="_ms2_init_text _ms2_init_center">Loading MapStore</div></span>)}
                </Theme>
                <Debug/>
            </div>
        );
    }
    renderWithTheme() {
        return (
            <div className={this.props.className}>
                <Theme {...this.props.themeCfg} version={this.props.version}/>
                <Localized messages={this.props.locale.messages} locale={this.props.locale.current} loadingError={this.props.locale.localeError}>
                    <ConnectedRouter history={history}>
                        <div>
                            {this.renderPages()}
                        </div>
                    </ConnectedRouter>
                </Localized>
                <Debug/>
            </div>);
    }
    render() {
        return this.props.loadAfterTheme ? this.renderAfterTheme() : this.renderWithTheme();
    }
    themeLoaded = () => {
        this.setState({
            themeLoaded: true
        });
    }
}

module.exports = StandardRouter;
