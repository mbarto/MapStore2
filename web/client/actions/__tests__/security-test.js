/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');
const security = require('../security');

describe('Test correctness of the close actions', () => {
    it('resetError', () => {
        const retval = security.resetError();
        expect(retval).toBeTruthy();
        expect(retval).toIncludeKey('type');
        expect(retval.type).toBe(security.RESET_ERROR);
    });
    it('loginSuccess', () => {
        const retval = security.loginSuccess();
        expect(retval).toBeTruthy();
        expect(retval).toIncludeKey('type');
        expect(retval).toIncludeKey('userDetails');
        expect(retval).toIncludeKey('authHeader');
        expect(retval).toIncludeKey('username');
        expect(retval).toIncludeKey('password');
        expect(retval).toIncludeKey('authProvider');
        expect(retval.type).toBe(security.LOGIN_SUCCESS);
    });
    it('loginFail', () => {
        const retval = security.loginFail();
        expect(retval).toBeTruthy();
        expect(retval).toIncludeKey('type');
        expect(retval).toIncludeKey('error');
        expect(retval.type).toBe(security.LOGIN_FAIL);
    });
    it('logout', () => {
        const retval = security.logout();
        expect(retval).toBeTruthy();
        expect(retval).toIncludeKey('type');
        expect(retval).toIncludeKey('redirectUrl');
        expect(retval.type).toBe(security.LOGOUT);
    });
    /* These are not exposed by the API
    it('changePasswordSuccess', () => {
        const retval = security.changePasswordSuccess();
        expect(retval).toBeTruthy().toIncludeKey('type')
        .toIncludeKey('user')
        .toIncludeKey('authHeader');
        expect(retval.type).toBe(security.CHANGE_PASSWORD_SUCCESS);
    });
    it('changePasswordFail', () => {
        const retval = security.changePasswordFail();
        expect(retval).toBeTruthy().toIncludeKey('type')
        .toIncludeKey('error');
        expect(retval.type).toBe(security.CHANGE_PASSWORD_FAIL);
    });
    */
    it('sessionValid', () => {
        const retval = security.sessionValid("aaa", "bbb");
        expect(retval).toBeTruthy();
        expect(retval).toIncludeKey('type');
        expect(retval).toIncludeKey('userDetails');
        expect(retval).toIncludeKey('authProvider');
        expect(retval.type).toBe(security.SESSION_VALID);
        expect(retval.userDetails).toBe("aaa");
        expect(retval.authProvider).toBe("bbb");
    });
    it('loginRequired, loginPromptClosed', () => {
        expect(security.loginRequired().type).toBe(security.LOGIN_REQUIRED);
        expect(security.loginPromptClosed().type).toBe(security.LOGIN_PROMPT_CLOSED);
    });
    it('checkLoggedUser', () => {
        expect(security.checkLoggedUser().type).toBe(security.CHECK_LOGGED_USER);
    });


});
