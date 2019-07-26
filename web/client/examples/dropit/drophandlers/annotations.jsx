const {saveAnnotation} = require('../../../actions/annotations');
const uuid = require('uuid');
const {DEFAULT_ANNOTATIONS_STYLES} = require('../../../utils/AnnotationsUtils');
const MapUtils = require('../../../utils/MapUtils');
const CoordinateUtils = require('../../../utils/CoordinatesUtils');

const getStyle = (text) => {
    const annotationsStyle = text.match(/^annotation(_(.*?))?(_(.*?))?(_(.*?))?$/);
    if (annotationsStyle) {
        return {
            ...DEFAULT_ANNOTATIONS_STYLES.Point,
            iconColor: annotationsStyle[2] || 'blue',
            iconShape: annotationsStyle[4] || 'square',
            iconGlyph: annotationsStyle[6] || 'comment'
        };
    }
    const labelStyle = text.match(/^label_(.*)$/);
    if (labelStyle) {
        return DEFAULT_ANNOTATIONS_STYLES.Text;
    }
    return DEFAULT_ANNOTATIONS_STYLES.Point;
};

const getGeometryType = (text) => {
    if (text.match(/^label_(.*)$/)) {
        return 'Point';
    }
    return 'Point';
};

const getProperties = (text, id) => {
    const label = text.match(/^label_(.*)$/);
    if (label) {
        return {
            id,
            valueText: label[1]
        };
    }
    return {
        id
    };
};

module.exports = (app) => ({
    canHandle(file) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: file.type.indexOf('image/') === 0 && file.name.indexOf('annotation') === 0 ? 10 : -1
            });
        });
    },
    canHandleText(text, type) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: text.match(/^(annotation)|(label_).*$/) && type === 'text/plain' ? 20 : -1
            });
        });
    },
    handleText(text, callback, type, evt) {
        const coordinates = CoordinateUtils.reproject(MapUtils.getHook(MapUtils.GET_COORDINATES_FROM_PIXEL_HOOK)([evt.x, evt.y]), 'EPSG:3857', 'EPSG:4326');
        const id = uuid.v1();
        const style = getStyle(text);
        const geometry = [{
            type: 'Feature',
            properties: getProperties(text, id),
            geometry: {
                type: getGeometryType(text),
                coordinates: [coordinates.x, coordinates.y]
            },
            style
        }];
        app.store.dispatch(saveAnnotation(id, {}, geometry, style, true, {}));
    },
    handle(file, callback, evt) {
        const annotation = file.name.indexOf('.') === -1 ? file.name : file.name.substring(0, file.name.lastIndexOf('.'));
        this.handleText(annotation, callback, '', evt);
    }
});
