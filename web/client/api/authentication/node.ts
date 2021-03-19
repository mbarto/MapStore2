import { AuthenticationApi } from "./api";
import {getConfigProp} from "../../utils/ConfigUtils";
import axios from "axios";

function getUrl(path: string): string {
    return `${getConfigProp("nodeUrl")}/auth/${path}`;
}

const nodeAPI : AuthenticationApi = {
    login(username, password, options) {
        return axios.post(`${getUrl("login")}`, {
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
        return axios.post(`${getUrl("changePassword")}`, {user, newPassword}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {});
    },
    refreshToken(accessToken, refreshToken, options) {
        return axios.post(`${getUrl("refresh")}`, {accessToken, refreshToken}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.data);
    },
    verifySession() {
        return axios.post(`${getUrl("verify")}`, {}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.data);
    }
};

export default nodeAPI;
