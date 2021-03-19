import ConfigUtils from '../../utils/ConfigUtils';

import geostore from '../GeoStoreDAO';
import memory from "./memory";
import node from "./node";

import {ApiProvider} from "../provider"
import {ResourcesApi, ResourcesFilter, ResourcesOptions} from "./api"

class Api extends ApiProvider<ResourcesApi> implements ResourcesApi {
    getResourcesByCategory = (category: string, query: string, options: ResourcesOptions) =>
        this.getApi().getResourcesByCategory(category, query, options);
    searchListByAttributes = (filter: ResourcesFilter, options: ResourcesOptions, url?: string) =>
        this.getApi().searchListByAttributes(filter, options, url);
}

const Resources = new Api("resourcesApi", "node");
Resources.addApi("geostore", geostore)
Resources.addApi("memory", memory)
Resources.addApi("node", node)

export default Resources;
