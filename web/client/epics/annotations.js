/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {connect} = require('../utils/PluginsUtils');
const Rx = require('rxjs');
const {MAP_CONFIG_LOADED} = require('../actions/config');
const {addLayer} = require('../actions/layers');
const {editAnnotation, removeAnnotation} = require('../actions/annotations');

const AnnotationsInfoViewer = connect(() => ({}),
{
    onEdit: editAnnotation,
    onRemove: removeAnnotation
})(require('../components/mapcontrols/annotations/AnnotationsInfoViewer'));

   /**
    * Epics for annotations
    * @name epics.annotations
    * @type {Object}
    */

module.exports = {
    addAnnotationsLayer: (action$) =>
    action$.ofType(MAP_CONFIG_LOADED)
        .switchMap(() => {
            return Rx.Observable.of(addLayer({
                type: 'vector',
                visibility: true,
                name: "Annotations",
                styleName: "marker",
                rowViewer: AnnotationsInfoViewer,
                features: [{
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [13, 43]
                  },
                  "properties": {
                    "id": 1,
                    "title": "Title",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ante erat, varius lacinia fermentum a, elementum vitae nunc. Duis sit amet neque vestibulum, sollicitudin eros in, sollicitudin sem. Morbi vestibulum sed mauris sed eleifend. Sed sed vestibulum turpis. Nam sollicitudin, neque id pharetra scelerisque, libero urna sollicitudin urna, eu sodales lorem est consequat magna. Etiam aliquam felis risus, id dictum leo sagittis ac. Sed et sollicitudin lorem. Sed pellentesque luctus hendrerit.",
                    "publisher": "admin",
                    "Create Date": "2017-09-08",
                    "Update Date": "2017-09-08"
                  }
              }, {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [13, 43]
                },
                "properties": {
                  "id": 2,
                  "title": "Title",
                  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ante erat, varius lacinia fermentum a, elementum vitae nunc. Duis sit amet neque vestibulum, sollicitudin eros in, sollicitudin sem. Morbi vestibulum sed mauris sed eleifend. Sed sed vestibulum turpis. Nam sollicitudin, neque id pharetra scelerisque, libero urna sollicitudin urna, eu sodales lorem est consequat magna. Etiam aliquam felis risus, id dictum leo sagittis ac. Sed et sollicitudin lorem. Sed pellentesque luctus hendrerit.",
                  "publisher": "admin",
                  "Create Date": "2017-09-08",
                  "Update Date": "2017-09-08"
                }
              }],
                hideLoading: true
            }));
        })
};
