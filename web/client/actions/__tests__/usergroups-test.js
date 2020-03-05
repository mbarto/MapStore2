/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');
const assign = require('object-assign');
const {
    GETGROUPS,
    STATUS_SUCCESS,
    STATUS_ERROR,
    getUserGroups,
    editGroup,
    EDITGROUP,
    changeGroupMetadata,
    EDITGROUPDATA,
    saveGroup,
    UPDATEGROUP,
    deleteGroup,
    DELETEGROUP,
    STATUS_DELETED,
    searchUsers,
    SEARCHUSERS
} = require('../usergroups');
let GeoStoreDAO = require('../../api/GeoStoreDAO');
let oldAddBaseUri = GeoStoreDAO.addBaseUrl;

describe('Test correctness of the usergroups actions', () => {
    beforeEach(() => {
        GeoStoreDAO.addBaseUrl = (options) => {
            return assign(options, {baseURL: 'base/web/client/test-resources/geostore/'});
        };
    });

    afterEach(() => {
        GeoStoreDAO.addBaseUrl = oldAddBaseUri;
    });
    it('get UserGroups', (done) => {
        const retFun = getUserGroups('usergroups.json', {params: {start: 0, limit: 10}});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(GETGROUPS);
            count++;
            if (count === 2) {
                expect(action.status).toBe(STATUS_SUCCESS);
                expect(action.groups).toBeTruthy();
                expect(action.groups[0]).toBeTruthy();
                expect(action.groups[0].groupName).toBeTruthy();
                done();
            }

        }, () => ({
            userGroups: {
                searchText: "*"
            }
        }));

    });
    it('getUserGroups error', (done) => {
        const retFun = getUserGroups('MISSING_LINK', {params: {start: 0, limit: 10}});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(GETGROUPS);
            count++;
            if (count === 2) {
                expect(action.status).toBe(STATUS_ERROR);
                expect(action.error).toBeTruthy();
                done();
            }

        });

    });
    it('edit UserGroup', (done) => {
        const retFun = editGroup({id: 1});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(EDITGROUP);
            count++;
            if (count === 2) {
                expect(action.group).toBeTruthy();
                expect(action.status).toBe("success");
                done();
            }
        });
    }, {security: {user: {role: "ADMIN"}}});

    it('edit UserGroup new', (done) => {
        let template = {groupName: "hello"};
        const retFun = editGroup(template);
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(EDITGROUP);
            count++;
            if (count === 1) {
                expect(action.group).toBeTruthy();
                expect(action.group).toBe(template);
                done();
            }
        });
    });

    it('close UserGroup edit', (done) => {
        const retFun = editGroup();
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(EDITGROUP);
            count++;
            if (count === 1) {
                expect(action.group).toBeFalsy();
                expect(action.status).toBeFalsy();
                done();
            }
        });
    });

    it('edit UserGroup error', (done) => {
        const retFun = editGroup({id: 99999});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(EDITGROUP);
            count++;
            if (count === 2) {
                expect(action.error).toBeTruthy();
                expect(action.status).toBe("error");
                done();
            }
        });
    });

    it('change usergroup metadata', () => {
        const action = changeGroupMetadata("groupName", "New Group Name");
        expect(action).toBeTruthy();
        expect(action.type).toBe(EDITGROUPDATA);
        expect(action.key).toBe("groupName");
        expect(action.newValue).toBe("New Group Name");

    });

    it('update usergroup', (done) => {
        // 1# is a workaround to skip the trailing slash of the request
        // that can not be managed by the test-resources
        const retFun = saveGroup({id: "1#", newUsers: [{id: 100, name: "name1"}]});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            if (action.type) {
                expect(action.type).toBe(UPDATEGROUP);
            }
            count++;
            if (count === 2) {
                expect(action.group).toBeTruthy();
                expect(action.status).toBe("saved");
            }
            if (count === 3) {
                // the third call is for update list
                done();
            }
        });
    });
    it('create usergroup', (done) => {
        GeoStoreDAO.addBaseUrl = (options) => {
            return assign(options, {baseURL: 'base/web/client/test-resources/geostore/usergroups/newGroup.txt#'});
        };
        const retFun = saveGroup({groupName: "TEST"});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            if (action.type) {
                expect(action.type).toBe(UPDATEGROUP);
            }
            count++;
            if (count === 2) {
                expect(action.group).toBeTruthy();
                expect(action.group.id).toBeTruthy();
                expect(action.group.id).toBe(1);
                expect(action.status).toBe("created");
            }
            if (count === 3) {
                // the third call is for update list
                done();
            }
        });
    });
    it('create usergroup with groups', (done) => {
        GeoStoreDAO.addBaseUrl = (options) => {
            return assign(options, {baseURL: 'base/web/client/test-resources/geostore/usergroups/newGroup.txt#'});
        };
        const retFun = saveGroup({groupName: "TEST", newUsers: [{id: 100, name: "name1"}]});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            if (action.type) {
                expect(action.type).toBe(UPDATEGROUP);
            }
            count++;
            if (count === 2) {
                expect(action.group).toBeTruthy();
                expect(action.group.id).toBeTruthy();
                expect(action.group.id).toBe(1);
                expect(action.status).toBe("created");
            }
            if (count === 3) {
                // the third call is for update list
                done();
            }
        });
    });

    it('delete Group', (done) => {
        let confirm = deleteGroup(1);
        expect(confirm).toBeTruthy();
        expect(confirm.status).toBe("confirm");
        const retFun = deleteGroup(1, "delete");
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            if (action.type) {
                expect(action.type).toBe(DELETEGROUP);
            }
            count++;
            if (count === 2) {
                expect(action.status).toBeTruthy();
                expect(action.status).toBe(STATUS_DELETED);
                expect(action.id).toBe(1);
                done();
            }
            if (count === 3) {
                // the third call is for update list
                done();
            }
        });
    });
    it('search users', (done) => {
        const retFun = searchUsers('users.json', 0, 10, {params: {start: 0, limit: 10}}, "");
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(SEARCHUSERS);
            count++;
            if (count === 2) {
                expect(action.users).toBeTruthy();
                expect(action.users[0]).toBeTruthy();
                expect(action.users[0].groups).toBeTruthy();
                done();
            }
        });
    });
    it('search users', (done) => {
        const retFun = searchUsers('MISSING_LINK', {params: {start: 0, limit: 10}});
        expect(retFun).toBeTruthy();
        let count = 0;
        retFun((action) => {
            expect(action.type).toBe(SEARCHUSERS);
            count++;
            if (count === 2) {
                expect(action.error).toBeTruthy();
                done();
            }
        });
    });
});
