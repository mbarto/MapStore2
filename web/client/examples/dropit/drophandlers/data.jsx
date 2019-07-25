const FileUtils = require('../../../utils/FileUtils');
const LayersUtils = require('../../../utils/LayersUtils');
const { success } = require('../../../actions/notifications');
const { addLayer } = require('../../../actions/layers');
const { zoomToExtent } = require('../../../actions/map');
const uuid = require('uuid');
const assign = require('object-assign');

const mapType = "leaflet";

const StyleUtils = require('../../../utils/StyleUtils')(mapType);

module.exports = (app) => ({
    name: 'Data',
    canHandle(file) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: (file.type === 'application/x-zip-compressed' ||
                    file.type === 'application/zip' || file.type === 'application/vnd.google-earth.kml+xml'
                    || file.type === 'application/vnd.google-earth.kmz' || file.type === 'application/gpx+xml' || FileUtils.MIME_LOOKUPS[FileUtils.recognizeExt(file.name)]) ? 10 : -1
            });
        });
    },
    canHandleText(text) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: this.isGeoJSON(text) ? 10 : -1
            });
        });
    },
    createLayer(geoJson) {
        const layer = geoJson.map((l) => {
            return LayersUtils.geoJSONToLayer(l, uuid.v1());
        });
        const styledLayer = StyleUtils.toVectorStyle(layer[0], {
            radius: 5,
            color: {
                a: 1,
                r: 0,
                g: 0,
                b: 255
            },
            width: 1,
            opacity: 1,
            fill: {
                a: 0.7,
                r: 0,
                g: 0,
                b: 255
            }
        });
        app.store.dispatch(addLayer(styledLayer));
        app.store.dispatch(zoomToExtent(styledLayer.bbox.bounds, styledLayer.bbox.crs));
        app.store.dispatch(success({
            title: 'New Data',
            message: 'New layer added to the page!'
        }));
    },
    handle(file) {
        const fileType = file.type || FileUtils.MIME_LOOKUPS[FileUtils.recognizeExt(file.name)];
        if (fileType === 'application/x-zip-compressed' ||
            fileType === 'application/zip') {
            FileUtils.readBuffer(file).then(buffer => {
                this.createLayer(FileUtils.shpToGeoJSON(buffer));
            });
        } else if (fileType === 'application/vnd.google-earth.kml+xml') {
            FileUtils.readKml(file).then(xml => {
                this.createLayer(FileUtils.kmlToGeoJSON(xml));
            });
        } else if (fileType === 'application/vnd.google-earth.kmz') {
            FileUtils.readKmz(file).then(xml => {
                this.createLayer(FileUtils.kmlToGeoJSON(xml));
            });
        } else if (fileType === 'application/gpx+xml') {
            FileUtils.readKml(file).then(xml => {
                this.createLayer(FileUtils.gpxToGeoJSON(xml));
            });
        }
    },
    isGeoJSON(text) {
        try {
            const json = JSON.parse(text);
            return json.type && (json.type === 'FeatureCollection' || json.type === 'Feature');
        } catch(e) {
            return false;
        }
    },
    handleText(text) {
        this.createLayer([assign({}, JSON.parse(text), {
            fileName: uuid.v1()
        })]);
    }
});
