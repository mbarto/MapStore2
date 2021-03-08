import {AuthenticationApi, Authenticated, UserData} from "./index"
import uuid from "uuid"

export type UserKey = string
export type AccessToken = string

export type Users = Map<UserKey, UserData>
export type Sessions = Map<AccessToken, Authenticated>

const users: Users = new Map<UserKey, UserData>()
const sessions: Sessions = new Map<AccessToken, Authenticated>()

let currentSession: Authenticated | undefined;

type MemoryAPI = {
    addUser(username: string, password: string, info: UserData): void
    clear(): void
}

function buildKey(username: string, password: string): UserKey {
    return `${username}:${password}`
}

function Now() {
    return new Date().getTime()
}

const ONE_HOUR = 60 * 60 * 1000

function getExpiration():number { return Now() + ONE_HOUR }

function isExpired(user: Authenticated): boolean {
    return user.expires < Now()
}

const memoryAPI : AuthenticationApi & MemoryAPI = {
    login(username, password, options) {
        const key = buildKey(username, password)
        if (users.has(key)) {
            const newSessionKey = uuid.v1();
            currentSession = {
                User: users.get(key) as UserData,
                access_token: newSessionKey,
                refresh_token: newSessionKey,
                expires: getExpiration(),
                token_type: "bearer"
            }
            sessions.set(newSessionKey, currentSession)
            return Promise.resolve(currentSession);
        }
        return Promise.reject(new Error("Wrong credentials"))
    },
    changePassword(user, newPassword, options) {
        // old password is not explicit here, assumes user authenticated through headers
        for (let key of users.keys()) {
            if (key.indexOf(`${user.name}:`) === 0) {
                const oldUser = users.get(key) as UserData
                users.delete(key)
                users.set(buildKey(user.name, newPassword), oldUser)
                return Promise.resolve()
            }
        }
        return Promise.reject();
    },
    refreshToken(accessToken, refreshToken, options) {
        if (sessions.has(accessToken)) {
            const user = sessions.get(accessToken) as Authenticated
            if (!isExpired(user)) {
                user.expires = getExpiration()
                return Promise.resolve(user)
            } else {
                if (currentSession?.access_token === accessToken) {
                    currentSession = undefined;
                }
                sessions.delete(accessToken)
            }
        }
        return Promise.reject("Unknown session");
    },
    verifySession(options) {
        if (currentSession) {
            return Promise.resolve(currentSession)
        }
        return Promise.reject();
    },
    addUser(username, password, info) {
        users.set(buildKey(username, password), info)
    },
    clear() {
        users.clear()
        sessions.clear()
        currentSession = undefined
    }
}

export default memoryAPI
