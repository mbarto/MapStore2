/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Rx = require('rxjs');
const {MAP_CONFIG_LOADED} = require('../actions/config');
const {addLayer, updateNode, changeLayerProperties} = require('../actions/layers');
const {hideMapinfoMarker, purgeMapInfoResults} = require('../actions/mapInfo');

const {updateAnnotationGeometry,
    CONFIRM_REMOVE_ANNOTATION, SAVE_ANNOTATION, EDIT_ANNOTATION, CANCEL_EDIT_ANNOTATION,
    TOGGLE_ADD} = require('../actions/annotations');

const {GEOMETRY_CHANGED} = require('../actions/draw');
const {PURGE_MAPINFO_RESULTS} = require('../actions/mapInfo');

const {head} = require('lodash');
const assign = require('object-assign');

const annotationsStyle = {
    iconGlyph: 'comment',
    iconShape: 'square'
};

const {changeDrawingStatus} = require('../actions/draw');

   /**
    * Epics for annotations
    * @name epics.annotations
    * @type {Object}
    */

const mergeGeometry = (features) => {
    return features.reduce((previous, feature) => {
        if (previous.type === 'Empty') {
            return feature.geometry;
        }
        if (previous.type === 'Point') {
            return {
                type: 'MultiPoint',
                coordinates: [previous.coordinates, feature.geometry.coordinates]
            };
        }
        return {
            type: 'MultiPoint',
            coordinates: previous.coordinates.concat([feature.geometry.coordinates])
        };
    }, {
        type: 'Empty'
    });
};

const toggleDrawOrEdit = (state) => {
    const drawing = state.annotations.drawing;
    const feature = state.annotations.editing;
    const drawOptions = {
        featureProjection: "EPSG:4326",
        stopAfterDrawing: false,
        editEnabled: !drawing,
        drawEnabled: drawing
    };
    return changeDrawingStatus("drawOrEdit", 'Point', "annotations", [feature], drawOptions, annotationsStyle);
};

module.exports = (viewer) => ({
    addAnnotationsLayer: (action$, store) =>
    action$.ofType(MAP_CONFIG_LOADED)
        .switchMap(() => {
            const annotationsLayer = head(store.getState().layers.flat.filter(l => l.id === 'annotations'));
            if (!annotationsLayer) {
                return Rx.Observable.of(addLayer({
                    type: 'vector',
                    visibility: true,
                    id: 'annotations',
                    name: "Annotations",
                    rowViewer: viewer,
                    hideLoading: true,
                    style: annotationsStyle,
                    features: [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [13, 43]
				},
				"properties": {
					"id": 1,
					"title": "Title",
					"description": "Lorem ipsum dolor sit amet, <b>consectetur</b> adipiscing elit. Nulla ante erat, varius lacinia fermentum a, elementum vitae nunc. Duis sit amet neque vestibulum, sollicitudin eros in, sollicitudin sem. Morbi vestibulum sed mauris sed eleifend. Sed sed vestibulum turpis. Nam sollicitudin, neque id pharetra scelerisque, libero urna sollicitudin urna, eu sodales lorem est consequat magna. Etiam aliquam felis risus, id dictum leo sagittis ac. Sed et sollicitudin lorem. Sed pellentesque luctus hendrerit."
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [12, 44]
				},
				"properties": {
					"id": 2,
					"title": "Title",
					"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ante erat, varius lacinia fermentum a, elementum vitae nunc. Duis sit amet neque vestibulum, sollicitudin eros in, sollicitudin sem. <i>Morbi vestibulum</i> sed mauris sed eleifend. Sed sed vestibulum turpis. Nam sollicitudin, neque id pharetra scelerisque, libero urna sollicitudin urna, eu sodales lorem est consequat magna. Etiam aliquam felis risus, id dictum leo sagittis ac. Sed et sollicitudin lorem. Sed pellentesque luctus hendrerit."
				}
			}],
                    handleClickOnLayer: true
                }));
            }
            return Rx.Observable.of(updateNode(
                'annotations', 'layer', {
                    rowViewer: viewer,
                    handleClickOnLayer: true
                }
            ));
        }),
    editAnnotation: (action$, store) =>
        action$.ofType(EDIT_ANNOTATION)
        .switchMap(() => {
            return Rx.Observable.from([
                changeLayerProperties('annotations', {visibility: false}),
                toggleDrawOrEdit(store.getState()),
                hideMapinfoMarker()
            ]);
        }),
    removeAnnotation: (action$, store) =>
        action$.ofType(CONFIRM_REMOVE_ANNOTATION)
        .switchMap((action) => {
            if (action.id === 'geometry') {
                return Rx.Observable.of(changeDrawingStatus("replace", 'Point', "annotations", [store.getState().annotations.editing], {}));
            }
            return Rx.Observable.from([
                updateNode('annotations', 'layer', {
                    features: head(store.getState().layers.flat.filter(l => l.id === 'annotations')).features.filter(f => f.properties.id !== action.id)
                }),
                hideMapinfoMarker(),
                purgeMapInfoResults()
            ]);
        }),
    saveAnnotation: (action$, store) =>
        action$.ofType(SAVE_ANNOTATION)
        .switchMap((action) => {
            return Rx.Observable.from([
                updateNode('annotations', 'layer', {
                    features: head(store.getState().layers.flat.filter(l => l.id === 'annotations')).features.map(f => assign({}, f, {
                        properties: f.properties.id === action.id ? assign({}, f.properties, action.fields) : f.properties,
                        geometry: f.properties.id === action.id ? action.geometry : f.geometry
                    }))
                }),
                changeDrawingStatus("clean", 'Point', "annotations", [], {}),
                changeLayerProperties('annotations', {visibility: true})
            ]);
        }),
    cancelEditAnnotation: (action$) =>
        action$.ofType(CANCEL_EDIT_ANNOTATION, PURGE_MAPINFO_RESULTS)
        .switchMap(() => {
            return Rx.Observable.from([
                changeDrawingStatus("clean", 'Point', "annotations", [], {}),
                changeLayerProperties('annotations', {visibility: true})
            ]);
        }),
    startDrawMarker: (action$, store) => action$.ofType(TOGGLE_ADD)
        .switchMap( () => {
            return Rx.Observable.of(toggleDrawOrEdit(store.getState()));
        }),
    endDrawMarker: (action$) => action$.ofType(GEOMETRY_CHANGED)
        .filter(action => action.owner === 'annotations')
        .switchMap( (action) => {
            return Rx.Observable.of(
                updateAnnotationGeometry(mergeGeometry(action.features))
            );
        })
});
