import { AuthenticationApi } from ".";
import {getConfigProp} from "../../utils/ConfigUtils";
import axios from "axios";

const nodeAPI : AuthenticationApi = {
    login(username, password, options) {
        return axios.post(`${getConfigProp("nodeUrl")}/login`, {
            user: username,
            password
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.data);
    },
    changePassword(user, newPassword, options) {
        return axios.post(`${getConfigProp("nodeUrl")}/changePassword`, {user, newPassword}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {});
    },
    refreshToken(accessToken, refreshToken, options) {
        return axios.post(`${getConfigProp("nodeUrl")}/refresh`, {accessToken, refreshToken}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.data);
    },
    verifySession() {
        return axios.post(`${getConfigProp("nodeUrl")}/verify`, {}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.data);
    }
};

export default nodeAPI;
