import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import * as MapActions from '../../web/client/actions/map';
import map from '../../web/client/reducers/map';
import * as MapSelectors from '../../web/client/selectors/map';
import {connect} from 'react-redux';

export const actions = {
    map: MapActions
};

export const selectors = {
    map: MapSelectors
};

export {connect};

export const withStore = (Component, initialState = {
    map: {
        center: {x: 13, y: 43, crs: 'EPSG:4326'},
        zoom: 5
    }
}, reducers = {map}) => {
    const store = createStore(combineReducers(reducers), initialState);
    return (props) => <Provider store={store} {...props}><Component /></Provider>;
};
