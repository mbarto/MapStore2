import ConfigUtils from '../../utils/ConfigUtils';

import geostore from '../GeoStoreDAO';
import memory from "./memory";
import node from "./node";

let Resources;
const ApiProviders = {
    geostore,
    memory,
    node
};
let api = "node";
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
    return ApiProviders[ConfigUtils.getConfigProp("resourcesApi") || api];
};

const getResourcesByCategory = (category, query, options) => getApi().getResourcesByCategory(category, query, options);
const searchListByAttributes = (filter, options, url) => getApi().searchListByAttributes(filter, options, url);

Resources = {
    addApi,
    setApi,
    getApi,
    authProviderName: api,
    getResourcesByCategory,
    searchListByAttributes
};

export default Resources;
