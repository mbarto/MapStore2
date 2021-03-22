import geostore from '../GeoStoreDAO';
import memory from "./memory";
import node from "./node";
import {ApiProviderType, createApiProvider} from "../provider"
import {AuthenticationApi} from "./api"

const Authentication: ApiProviderType<AuthenticationApi> & AuthenticationApi = {
    ...createApiProvider("authenticationApi", "node"),
    login: (username, password, options) =>
        Authentication.getApi().login(username, password, options),
    changePassword: (user, newPassword, options) =>
        Authentication.getApi().changePassword(user, newPassword, options),
    refreshToken: (accessToken, refreshToken, options) =>
        Authentication.getApi().refreshToken(accessToken, refreshToken, options),
    verifySession: (options) => Authentication.getApi().verifySession(options)
};

Authentication.addApi("geostore", geostore)
Authentication.addApi("memory", memory)
Authentication.addApi("node", node)

export default Authentication;
