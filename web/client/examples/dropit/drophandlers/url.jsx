const axios = require('../../../libs/ajax');
const xml2js = require('xml2js');

const { addLayer } = require('../../../actions/layers');
const WMS = require('../../../api/WMS');
const CatalogUtils = require('../../../utils/CatalogUtils');
const { zoomToExtent } = require('../../../actions/map');

const expandExtent = (extent, newExtent) => {
    return [Math.min(extent[0], newExtent[0]), Math.min(extent[1], newExtent[1]), Math.max(extent[2], newExtent[2]), Math.max(extent[3], newExtent[3])];
};

module.exports = (app) => ({
    canHandle() {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: -1
            });
        });
    },
    canHandleText(text, type) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: text.match(/^http(s)?:\/\/.*$/) && type === 'text/plain' ? 20 : -1
            });
        });
    },
    handleText(url) {
        axios.get(url).then((response) => {
            xml2js.parseString(response.data, { explicitArray: false }, (ignore, json) => {
                const layers = CatalogUtils.getCatalogRecords('wms', WMS.searchAndPaginate(json, 0, Number.MAX_VALUE, ""), {url});
                let extent;
                let crs;
                layers.forEach(layer => {
                    app.store.dispatch(addLayer(CatalogUtils.recordToLayer(layer, "wms", {
                        url
                    }, {})));
                    if (layer.boundingBox) {
                        if (!extent) {
                            extent = layer.boundingBox.extent;
                            crs = layer.boundingBox.crs;
                        } else {
                            extent = expandExtent(extent, layer.boundingBox.extent, layer.boundingBox.crs);
                        }
                    }
                    if (extent) {
                        app.store.dispatch(zoomToExtent(extent, crs));
                    }
                });
            });
        });
    }
});
