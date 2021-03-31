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

export type UserData = {
    id: number
    name: string
    attribute: Attribute[],
    enabled: boolean
    groups: Group[]
    role: "USER" | "ADMIN" | "GUEST"
}

export type ServiceOptions = {
    [key: string]: string
}

export type AuthenticationData = {
    access_token: string
    expires: number
    refresh_token: string
    token_type: "bearer"
}

export type Authenticated = AuthenticationData & {User: UserData}

export type AuthenticationApi = {
    login: (username: string, password: string, options: ServiceOptions) => Promise<Authenticated>
    changePassword: (user: UserData, newPassword: string, options: ServiceOptions) => Promise<void>
    refreshToken: (accessToken: string, refreshToken: string, options: ServiceOptions) => Promise<Authenticated>
    verifySession: (options: ServiceOptions) => Promise<Authenticated>
}

