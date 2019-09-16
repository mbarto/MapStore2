/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import './assets/css/plugins.css';

import { connect, Provider } from 'react-redux';

import Debug from '../../components/development/Debug';

import assign from 'object-assign';
import {createStore} from './store';
import { savePluginConfig, compileError, resetError }  from './actions/config';

import { changeBrowserProperties } from '../../actions/browser';
import { loadMapConfig } from '../../actions/config';
import { loadLocale } from '../../actions/locale';
import { loadPrintCapabilities } from '../../actions/print';
import { selectTheme } from '../../actions/theme';
import { changeMapType } from '../../actions/maptype';

import LocalizedCmp from '../../components/I18N/Localized';
import PluginsContainerCmp from '../../components/plugins/PluginsContainer';
import ThemeSwitcherCmp from '../../components/theme/ThemeSwitcher';
import ThemeCmp from '../../components/theme/Theme';

import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
import PluginsUtils from '../../utils/PluginsUtils';
import ThemeUtils from '../../utils/ThemeUtils';

import {FormControl, Button} from 'react-bootstrap';
import staticPlugins from './plugins';


function startApp(plugins, lazyLoad) {
    /* const ConfigUtils = require('../../utils/ConfigUtils');
const LocaleUtils = require('../../utils/LocaleUtils');
const PluginsUtils = require('../../utils/PluginsUtils');
const ThemeUtils = require('../../utils/ThemeUtils');

const { changeBrowserProperties } = require('../../actions/browser');
const { loadMapConfig } = require('../../actions/config');
const { loadLocale } = require('../../actions/locale');
const { loadPrintCapabilities } = require('../../actions/print');
const { selectTheme } = require('../../actions/theme');
const { changeMapType } = require('../../actions/maptype');*/
    const PluginsContainer = connect((state) => ({
        pluginsState: state && state.controls || {}
    }))(PluginsContainerCmp);

    const ThemeSwitcher = connect((state) => ({
        selectedTheme: state.theme && state.theme.selectedTheme || 'default',
        themes: require('../../themes')
    }), {
        onThemeSelected: selectTheme
    })(ThemeSwitcherCmp);

    const Theme = connect((state) => ({
        theme: state.theme && state.theme.selectedTheme && state.theme.selectedTheme.id || 'default'
    }))(ThemeCmp);

    let pluginsCfg = {
        standard: ['Map', 'Toolbar']
    };

    let userCfg = {};

    let customReducers;
    const customReducer = (state = {}, action) => {
        if (customReducers) {
            const newState = assign({}, state);
            Object.keys(customReducers).forEach((stateKey) => {
                assign(newState, { [stateKey]: customReducers[stateKey](state[stateKey], action) });
            });
            return newState;
        }
        return state;
    };

    const store = createStore(plugins, customReducer);

    // require('./assets/css/plugins.css');

    // const Babel = require('babel-standalone');

    let mapType = 'leaflet';

    const Localized = connect((state) => ({
        messages: state.locale && state.locale.messages,
        locale: state.locale && state.locale.current,
        loadingError: state.locale && state.locale.localeError
    }))(LocalizedCmp);


    const getPluginsConfiguration = () => {
        return {
            standard: pluginsCfg.standard.map((plugin) => ({
                name: plugin,
                cfg: userCfg[plugin + 'Plugin'] || {}
            }))
        };
    };
    const loadedPlugins = {};

    const getPlugins = () => {
        return assign({}, plugins, loadedPlugins);
    };
    let pluginNameEl = '';

    const renderPage = () => {
        ReactDOM.render(
            <Provider store={store}>
                <Localized>
                    <div style={{ width: "100%", height: "100%" }}>
                        <Theme path="../../dist/themes" version="no_version" />
                        <div id="plugins-list" style={{ position: "absolute", zIndex: "10000", width: "300px", left: 0, height: "100%", overflow: "auto" }}>
                            <h5>Configure application plugins</h5>
                            <input ref={(pluginEl) => { pluginNameEl = pluginEl; }} />
                            <Button onClick={loadPlugin}>Add</Button>
                        </div>
                        <div style={{ position: "absolute", right: 0, left: "300px", height: "100%", overflow: "hidden" }}>
                            <PluginsContainer params={{ mapType }} plugins={PluginsUtils.getPlugins(getPlugins())} pluginsConfig={getPluginsConfiguration()} mode="standard" />
                        </div>
                        <Debug />
                    </div>
                </Localized>
            </Provider>
            ,
            document.getElementById("container"));
    };

    const loadPlugin = () => {
        lazyLoad(pluginNameEl.value, (name, plugin) => {
            loadedPlugins[name + 'Plugin'] = plugin;
            pluginsCfg.standard.push(name);
            renderPage();
        });
    };

    ConfigUtils.loadConfiguration().then(() => {
        store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));

        store.dispatch(loadPrintCapabilities(ConfigUtils.getConfigProp('printUrl')));

        renderPage();
    });
}


import(/* webpackChunkName: "plugins-def" */'./dynamicPlugins').then((dynamicPlugins) => {
    startApp(staticPlugins, dynamicPlugins.default);
});
