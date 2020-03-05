/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const expect = require('expect');
const assign = require('object-assign');
const PropTypes = require('prop-types');

const React = require('react');
const ReactDOM = require('react-dom');
const PluginsContainer = require('../PluginsContainer');

class My extends React.Component {
    render() {
        return <div/>;
    }
    myFunc() {}
}
class Container extends React.Component {
    static propTypes = {
        items: PropTypes.any
    }
    render() {
        const {items} = this.props;
        const renderCmp = (item = {}) => {
            const ItemCmp = item.plugin;
            if (ItemCmp) {
                return <ItemCmp />;
            }
            return <div id={`no-impl-item-${item.name}`} />;

        };
        return (<React.Fragment>
            {items.map(renderCmp)}
        </React.Fragment>);
    }

}

class NoRootPlugin extends React.Component {
    render() {
        return <div id="no-root"/>;
    }
}
const plugins = {
    MyPlugin: My,
    OtherPlugin: My,
    ContainerPlugin: Container,
    NoRootPlugin: assign(NoRootPlugin, { noRoot: true, Container: {
        name: 'no-root-plugin',
        position: 1,
        priority: 1
    }})
};

const pluginsCfg = {
    desktop: [ "My", {
        name: "Other",
        cfg: {
            disablePluginIf: "{true}"
        }
    }]
};

const pluginsCfg2 = {
    desktop: ["My", "Other"]
};

const pluginsCfg3 = {
    desktop: ["My", "NoRoot"]
};
const pluginsCfg4 = {
    desktop: ["Container", "NoRoot"]
};

describe('PluginsContainer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('checks filterDisabledPlugins one disabled', () => {
        const cmp = ReactDOM.render(<PluginsContainer mode="desktop" defaultMode="desktop" params={{}}
            plugins={plugins} pluginsConfig={pluginsCfg}/>, document.getElementById("container"));
        expect(cmp).toBeTruthy();

        const cmpDom = ReactDOM.findDOMNode(cmp);
        expect(cmpDom).toBeTruthy();

        const rendered = cmpDom.getElementsByTagName("div");
        expect(rendered.length).toBe(1);
    });

    it('checks filterDisabledPlugins no disabled', () => {
        const cmp = ReactDOM.render(<PluginsContainer mode="desktop" defaultMode="desktop" params={{}}
            plugins={plugins} pluginsConfig={pluginsCfg2} />, document.getElementById("container"));
        expect(cmp).toBeTruthy();

        const cmpDom = ReactDOM.findDOMNode(cmp);
        expect(cmpDom).toBeTruthy();

        const rendered = cmpDom.getElementsByTagName("div");
        expect(rendered.length).toBe(2);
    });
    it('test noRoot option disable root rendering of plugins', () => {
        // Not rendered without container
        let cmp = ReactDOM.render(<PluginsContainer mode="desktop" defaultMode="desktop" params={{}}
            plugins={plugins} pluginsConfig={pluginsCfg3} />, document.getElementById("container"));
        expect(cmp).toBeTruthy();

        let cmpDom = ReactDOM.findDOMNode(cmp);
        expect(cmpDom).toBeTruthy();

        let rendered = cmpDom.getElementsByTagName("div");

        // rendered in container
        expect(rendered.length).toBe(1);
        cmp = ReactDOM.render(<PluginsContainer mode="desktop" defaultMode="desktop" params={{}}
            plugins={plugins} pluginsConfig={pluginsCfg4} />, document.getElementById("container"));
        expect(cmp).toBeTruthy();

        cmpDom = ReactDOM.findDOMNode(cmp);
        expect(cmpDom).toBeTruthy();

        rendered = cmpDom.getElementsByTagName("div");
        expect(document.getElementById('no-impl-item-no-root-plugin')).toBeFalsy();
        expect(document.getElementById('no-root')).toBeTruthy();
    });
});
