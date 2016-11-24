
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Layers = require('../../../../utils/leaflet/Layers');
const CoordinatesUtils = require('../../../../utils/CoordinatesUtils');
const WMTSUtils = require('../../../../utils/leaflet/WMTSUtils');
const L = require('leaflet');
const objectAssign = require('object-assign');
const {isArray, isEqual} = require('lodash');
const SecurityUtils = require('../../../../utils/SecurityUtils');

L.tileLayer.wmts = function(url, options) {
    return new L.TileLayer.WMTS(url, options);
};

function wmtsToLeafletOptions(options) {
    var opacity = options.opacity !== undefined ? options.opacity : 1;
    // NOTE: can we use opacity to manage visibility?
    return objectAssign({}, options.baseParams, {
        layer: options.name,
        style: options.style || "",
        format: options.format || 'image/png',
        opacity: opacity,
        tilematrixSet: CoordinatesUtils.normalizeSRS(options.srs || 'EPSG:3857', options.allowedSRS)
    }, options.params || {});
}

function getWMTSURLs( urls ) {
    return urls.map((url) => url.split("\?")[0]);
}

Layers.registerType('wmts', {
    create: (options) => {
        const urls = getWMTSURLs(isArray(options.url) ? options.url : [options.url]);
        const queryParameters = wmtsToLeafletOptions(options) || {};
        urls.forEach(url => SecurityUtils.addAuthenticationParameter(url, queryParameters));
        const layer = L.tileLayer.wmts(urls[0], queryParameters);
        layer.matrixIds = layer.matrixIds.map((l) => objectAssign({}, l, {
            identifier: CoordinatesUtils.normalizeSRS(options.srs || 'EPSG:3857', options.allowedSRS) + ':' + l.identifier
        }));
        return layer;
    },
    update: function(layer, newOptions, oldOptions) {
        // find the options that make a parameter change
        let oldqueryParameters = WMTSUtils.filterWMTSParamOptions(wmtsToLeafletOptions(oldOptions));
        let newQueryParameters = WMTSUtils.filterWMTSParamOptions(wmtsToLeafletOptions(newOptions));
        let newParameters = Object.keys(newQueryParameters).filter((key) => {return newQueryParameters[key] !== oldqueryParameters[key]; });
        let newParams = {};
        if ( newParameters.length > 0 ) {
            newParameters.forEach( key => newParams[key] = newQueryParameters[key] );
            // set new options as parameters, merged with params
            layer.setParams(objectAssign(newParams, newParams.params, newOptions.params));
        } else if (!isEqual(newOptions.params, oldOptions.params)) {
            layer.setParams(newOptions.params);
        }
    }
});
