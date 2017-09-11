/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const EDIT_ANNOTATION = 'ANNOTATIONS:EDIT';
const REMOVE_ANNOTATION = 'ANNOTATIONS:REMOVE';

function editAnnotation(id) {
    return {
        type: EDIT_ANNOTATION,
        id
    };
}
function removeAnnotation(id) {
    return {
        type: REMOVE_ANNOTATION,
        id
    };
}

module.exports = {
    EDIT_ANNOTATION,
    REMOVE_ANNOTATION,
    editAnnotation,
    removeAnnotation
};
