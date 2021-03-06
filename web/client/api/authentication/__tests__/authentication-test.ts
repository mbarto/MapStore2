import Authentication, {UserData} from "../index"
import expect from "expect"
import memory from "../memory"

const USERNAME = "user"
const PASSWORD = "password"

const SAMPLE_USER: UserData = {
    id: 1,
    name: USERNAME,
    enabled: true,
    attribute: [],
    role: "USER",
    groups: []
}

describe("authentication api", () => {
    beforeEach(() => {
        Authentication.setApi("memory");
        memory.addUser(USERNAME, PASSWORD, SAMPLE_USER)
    })
    afterEach(() => {
        Authentication.setApi("geostore");
        memory.clear()
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
    it("change password", (done) => {
        Authentication.changePassword(SAMPLE_USER, "new password", {}).then(() => {
            Authentication.login(USERNAME, "new password", {}).then(auth => {
                expect(auth.User).toExist()
                done()
            })
        })
    })
    it("refresh token", (done) => {
        Authentication.login(USERNAME, PASSWORD, {}).then(auth => {
            expect(auth.access_token).toExist()
            expect(auth.refresh_token).toExist()
            Authentication.refreshToken(auth.access_token, auth.refresh_token, {}).then((auth) => {
                expect(auth.User).toExist()
                done()
            })
        })
    })
    it("refresh wrong token", (done) => {
        Authentication.login(USERNAME, PASSWORD, {}).then(auth => {
            expect(auth.access_token).toExist()
            expect(auth.refresh_token).toExist()
            Authentication.refreshToken("wrong token", "wrong refresh token", {}).catch(() => {
                done()
            })
        })
    })
    it("verify session", (done) => {
        Authentication.login(USERNAME, PASSWORD, {}).then(auth => {
            expect(auth.access_token).toExist()
            expect(auth.refresh_token).toExist()
            Authentication.verifySession({}).then((auth) => {
                expect(auth.User).toExist()
                done()
            })
        })
    })
    it("verify session without login", (done) => {
        Authentication.verifySession({}).catch(() => {
            done()
        })
    })
})
