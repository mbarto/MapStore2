/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import ReactDOM from "react-dom";
import { ensureIntl } from "../utils/LocaleUtils";
import { connect } from "react-redux";

import { loadVersion } from "../actions/version";

import { versionSelector } from "../selectors/version";
import { loadAfterThemeSelector } from "../selectors/config";
import StandardApp from "../components/app/StandardApp";
import StandardRouter from "../components/app/StandardRouter";
import StandardStore from "../stores/StandardStore";

import version from "../reducers/version";

import { setObservableConfig } from 'recompose';

import rxjsConfig from 'recompose/rxjsObservableConfig';
setObservableConfig(rxjsConfig);

const main = (config = {}, pluginsDef = {}, overrideConfig = cfg => cfg) => {
    const startApp = () => {
        const {
            appEpics = {},
            baseEpics,
            appReducers = {},
            baseReducers,
            initialState,
            pages,
            printingEnabled = true,
            storeOpts,
            themeCfg = {},
            mode
        } = config;

        const AppComponent = connect((state) => ({
            locale: state.locale || {},
            pages,
            themeCfg,
            version: versionSelector(state),
            loadAfterTheme: loadAfterThemeSelector(state)
        }))(StandardRouter);

        /**
         * appStore data needed to create the store
         * @param {object} baseReducers is used to override all the appReducers
         * @param {object} appReducers is used to extend the appReducers
         * @param {object} baseEpics is used to override all the appEpics
         * @param {object} appEpics is used to extend the appEpics
         * @param {object} initialState is used to initialize the state of the application
        */
        const appStore = StandardStore.bind(null,
            initialState,
            baseReducers || {
                version,
                ...appReducers
            },
            baseEpics || {
                ...appEpics
            }
        );

        const initialActions = [
            loadVersion
        ];

        const appConfig = overrideConfig({
            storeOpts,
            appEpics,
            appStore,
            pluginsDef,
            initialActions,
            appComponent: AppComponent,
            printingEnabled,
            themeCfg,
            mode
        });

        ReactDOM.render(
            <StandardApp enableExtensions {...appConfig} />,
            document.getElementById('container')
        );
    };

    if (!global.Intl) {
        // Ensure Intl is loaded, then call the given callback
        ensureIntl(startApp);
    } else {
        startApp();
    }
};

export default main;
