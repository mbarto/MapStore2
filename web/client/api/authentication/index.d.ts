export type AuthenticationApi = {
    login: (username: string, password: string, options: ServiceOptions) => Promise<Authenticated>
    changePassword: (user: string, newPassword: string, options: ServiceOptions) => Promise<void>
    refreshToken: (accessToken: string, refreshToken: string, options: ServiceOptions) => Promise<Authenticated>
    verifySession: () => Promise<Authenticated>
}

declare namespace Authentication {
    export function setApi(name: string): void
    export function addApi(name: string, impl: AuthenticationApi): void
    let authProviderName: string
    export function login(username: string, password: string, options: ServiceOptions): Promise<Authenticated>
    export function changePassword(user: string, newPassword: string, options: ServiceOptions): Promise<void>
    export function refreshToken(accessToken: string, refreshToken: string, options: ServiceOptions): Promise<Authenticated>
    export function verifySession(): Promise<Authenticated>
}

export type ServiceOptions = {
    [key: string]: string
}

export type Authenticated = AuthenticationData & UserData

export type AuthenticationData = {
    access_token: string
    expires: number
    refresh_token: string
    token_type: "bearer"
}

export type UserData = {
    User: {
        id: number
        name: string
        attribute: Attribute[],
        enabled: boolean
        groups: Group[]
        role: "USER" | "ADMIN"
    }
}

export type Attribute = {
    name: string
    value: string
}

export type Group = {
    id: number
    groupName: string
    description: string
    enabled: boolean
}

export default Authentication
