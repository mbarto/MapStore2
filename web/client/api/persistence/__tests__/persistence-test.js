/**
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Persistence from "../index";
import expect from "expect";
import {Observable} from "rxjs";

const resources = {
    1: {
        id: 1
    }
};

const MemoryPersistence = {
    getResource: (id) => Observable.of(resources[id])
};

describe('Persistence API', () => {
    beforeEach((done) => {
        Persistence.addApi("memory", MemoryPersistence);
        Persistence.setApi("memory");
        setTimeout(done);
    });
    afterEach((done) => {
        Persistence.setApi("geostore");
        setTimeout(done);
    });
    it("fetches a resource by id", (done) => {
        Persistence.getResource(1).toPromise().then(r => {
            expect(r.id).toBe(1);
            done();
        });
    });
});
