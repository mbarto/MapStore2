import geostore from '../GeoStoreDAO';
import memory from "./memory";
import node from "./node";

import {ApiProviderType, createApiProvider} from "../provider"
import {ResourcesApi} from "./api"

const Resources: ApiProviderType<ResourcesApi> & ResourcesApi = {
    ...createApiProvider("resourcesApi", "node"),
    getResourcesByCategory: (category, query, options) =>
        Resources.getApi().getResourcesByCategory(category, query, options),
    searchListByAttributes: (filter, options, url) =>
        Resources.getApi().searchListByAttributes(filter, options, url)
}

Resources.addApi("geostore", geostore)
Resources.addApi("memory", memory)
Resources.addApi("node", node)

export default Resources;
