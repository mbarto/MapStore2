# Authentication API

```typescript
type Attribute = {
    name: string
    value: string
}

type Group = {
    id: number
    groupName: string
}

type UserDetail = {
    enabled: boolean
    id: number
    name: string
    role: string
    attribute: Attribute[]
    groups: Group[]
}

type UserInfo = {
    User: UserDetail
    access_token: string
    refresh_token: string
    expires: number // seconds
}

function login(username: string, password: string): Promise<UserInfo>

function changePassword(username: string, newPassword: string): unknown

function refreshToken(accessToken: string, refreshToken: string): unknown

function verifySession(): unknown

```
