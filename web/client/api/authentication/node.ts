import { AuthenticationApi } from ".";
import {getConfigProp} from "../../utils/ConfigUtils";

const nodeAPI : AuthenticationApi = {
    login(username, password, options) {
        return fetch(`${getConfigProp("nodeUrl")}/login`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({user: username, password})
        }).then(response => response.json())
    },
    changePassword(user, newPassword, options) {
        return Promise.resolve()
    },
    refreshToken(accessToken, refreshToken, options) {
        return fetch(`${getConfigProp("nodeUrl")}/refresh`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({accessToken, refreshToken})
        }).then(response => response.json())
    },
    verifySession() {
        return fetch(`${getConfigProp("nodeUrl")}/verify`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({})
        }).then(response => response.json())
    }
}

export default nodeAPI
