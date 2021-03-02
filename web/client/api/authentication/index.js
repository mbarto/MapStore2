import ConfigUtils from '../../utils/ConfigUtils';

import geostore from '../GeoStoreDAO';

let Authentication;
const ApiProviders = {
    geostore
};
let api = "geostore";
/**
* Add a new API implementation
* @param {string} name the key of the added api implementation
* @param {object} apiImpl the api implementation
*/
export const addApi = (name, apiImpl) => {
    ApiProviders[name] = apiImpl;
};
/**
* Set the current API
* @param {string} name the key of the api implementation to be used
*/
export const setApi = (name = "geostore") => {
    api = name;
};
/**
* Add a new api implementation
* @return {object} Current api
*/
const getApi = () => {
    return ApiProviders[ConfigUtils.getConfigProp("authenticationApi") || api];
};

const login = (username, password, options) => getApi().login(username, password, options);
const changePassword = (user, newPassword, options) => getApi().changePassword(user, newPassword, options);
const refreshToken = (accessToken, refreshToken, options) => getApi().refreshToken(accessToken, refreshToken, options);
const verifySession = () => getApi().verifySession();

Authentication = {
    addApi,
    setApi,
    getApi,
    authProviderName: api,
    login,
    changePassword,
    refreshToken,
    verifySession
};

export default Authentication;
