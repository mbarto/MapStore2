const {endsWith} = require('lodash');
const Babel = require('babel-standalone');
const uuid = require('uuid');
const {success} = require('../../../actions/notifications');
const FileUtils = require('../../../utils/FileUtils');
const {connect} = require('react-redux');
const Template = require('../../../components/data/template/jsx/Template');
const assign = require('object-assign');

const customPlugin = (code, app, callback) => {
    /*eslint-disable */
    const context = require('../context');
    const require = context;
    const React = app.React;
    const module = {};
    try {
        app.customReducers = assign({}, app.customReducers, eval(Babel.transform(code, { presets: ['es2015', 'react', 'stage-0'] }).code).reducers || null);

        /*eslint-enable */
        const plugin = connect(() => ({
            template: code,
            renderContent: (comp) => {
                /*eslint-disable */
                return eval(comp).Plugin;
                /*eslint-enable */
            },
            getReducers() {
                return this.comp;
            }
        }), {
                onError: () => { }
            })(Template);

        callback(plugin);
    } catch (e) {
        // TODO
    }
};

module.exports = (app) => ({
    name: 'Plugin',
    canHandle(file) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: endsWith(file.name.split('.')[0], "Plugin") ? 10 : -1
            });
        });
    },
    canHandleText(text, type) {
        return new Promise((resolve) => {
            try {
                if (endsWith(text, "Plugin") && app.plugins[text]) {
                    resolve({
                        handler: this,
                        priority: 10
                    });
                } else {
                    const compiled = Babel.transform(text, { presets: ['es2015', 'react', 'stage-0'] });
                    resolve({
                        handler: this,
                        priority: compiled.code ? 10 : -1
                    });
                }
            } catch (e) {
                // TODO
            }
            resolve({
                handler: this,
                priority: -1
            });
        });
    },
    handle(file, callback) {
        const fileName = file.name.split('.')[0];
        const pluginName = fileName.substring(0, fileName.length - 6);

        if (app.plugins[fileName]) {
            app.pluginsCfg.standard.push(pluginName);
            app.store.dispatch(success({
                title: 'Added new Plugin',
                message: pluginName + ' Plugin added to the page!'
            }));
            callback();
        } else {
            FileUtils.readText(file)
                .then((code) => {
                    customPlugin(code, app, (plugin) => {
                        app.userPlugins[fileName] = { [fileName]: plugin };
                        app.pluginsCfg.standard.push(pluginName);
                        app.store.dispatch(success({
                            title: 'Added new Plugin',
                            message: pluginName + ' Plugin added to the page!'
                        }));
                        callback();
                    });
                });
        }
    },
    handleText(code, callback) {
        if (app.plugins[code]) {
            const pluginName = code.substring(0, code.length - 6);
            app.pluginsCfg.standard.push(pluginName);
            app.store.dispatch(success({
                title: 'Added new Plugin',
                message: pluginName + ' Plugin added to the page!'
            }));
            callback();
        } else {
            customPlugin(code, app, (plugin) => {
                const pluginName = plugin.pluginName || uuid.v1();
                const fileName = pluginName + 'Plugin';
                app.userPlugins[fileName] = { [fileName]: plugin };
                app.pluginsCfg.standard.push(pluginName);
                app.store.dispatch(success({
                    title: 'Added new Plugin',
                    message: pluginName + ' Plugin added to the page (Custom user plugin)!'
                }));
                callback();
            });
        }
    }
});
