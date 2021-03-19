import { ResourcesApi } from "./api";
import {getConfigProp} from "../../utils/ConfigUtils";
import axios from "axios";

function getUrl(path: string): string {
    return `${getConfigProp("nodeUrl")}/resources/${path}`;
}

const nodeAPI : ResourcesApi = {
    getResourcesByCategory(category, query, options) {
        return axios.get(`${getUrl("search")}/category/${category}/${query}?start=${options.params.start}&limit=${options.params.limit}`)
            .then(response => response.data);
    },
    searchListByAttributes(filter, options) {
        return axios.post(`${getUrl("search")}/list?includeAttributes=${options.params.includeAttributes}&start=${options.params.start}&limit=${options.params.limit}`, {filter}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.data);
    }
};

export default nodeAPI;
