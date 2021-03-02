
import Authentication, {Authenticated, AuthenticationApi} from "../index"
import expect from "expect"

const USERNAME = "user"
const PASSWORD = "password"

const authenticated: Authenticated = {
    User: {
        id: 1,
        name: USERNAME,
        enabled: true,
        attribute: [],
        role: "USER",
        groups: []
    },
    access_token: "token",
    expires: 86400,
    refresh_token: "refresh",
    token_type: "bearer"
}

const MockApi: AuthenticationApi = {
    login: (username, password, options) => username === USERNAME && password === PASSWORD ?
        Promise.resolve(authenticated) :
        Promise.reject(new Error("wrong password")),
    changePassword: (user, newPassword, options) => Promise.resolve(),
    refreshToken: (accessToken, refreshToken, options)=> Promise.resolve(authenticated),
    verifySession: () => Promise.resolve(authenticated)
}

describe("authentication api", () => {
    beforeEach(() => {
        Authentication.addApi("mock", MockApi);
        Authentication.setApi("mock");
    })
    afterEach(() => {
        Authentication.setApi("geostore");
    })
    it("login successful", (done) => {
        Authentication.login(USERNAME, PASSWORD, {}).then(auth => {
            expect(auth.User).toExist()
            done()
        })
    })
    it("login failed", (done) => {
        Authentication.login(USERNAME, "wrong password", {}).catch(e => {
            expect(e).toExist()
            done()
        })
    })
})
