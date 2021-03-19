import geostore from '../GeoStoreDAO';
import memory from "./memory";
import node from "./node";
import {ApiProvider} from "../provider"
import {AuthenticationApi, ServiceOptions, UserData} from "./api"

class Api extends ApiProvider<AuthenticationApi> implements AuthenticationApi {
    login = (username: string, password: string, options: ServiceOptions) =>
        this.getApi().login(username, password, options);
    changePassword = (user: UserData, newPassword: string, options: ServiceOptions) =>
        this.getApi().changePassword(user, newPassword, options);
    refreshToken = (accessToken: string, refreshToken: string, options: ServiceOptions) =>
        this.getApi().refreshToken(accessToken, refreshToken, options);
    verifySession = (options: ServiceOptions) => this.getApi().verifySession(options);
}

const Authentication = new Api("authenticationApi", "node");
Authentication.addApi("geostore", geostore)
Authentication.addApi("memory", memory)
Authentication.addApi("node", node)

export default Authentication;
