
import {UserData, Group} from "../client/api/authentication/api";
import memory from "../client/api/authentication/memory";
import fs from "fs";
import express from "express";

type UserWithCredentials = Omit<UserData, "groups"> & {
    password: string,
    groups: string[]
}

type UsersFile = {
    users: UserWithCredentials[],
    groups: Group[]
}

export const everyOneGroup: Group = {
    id: 0,
    groupName: "everyOne",
    description: "",
    enabled: true
}

let usersFile: UsersFile;

function readUsers(): boolean {
    try {
        usersFile = JSON.parse(fs.readFileSync("users.json", {
            encoding: "utf-8"
        }))
        const {users, groups} = usersFile;
        memory.clear()
        users.filter(u => u.enabled).forEach(user => {
            const {password, groups: userGroups, ...userData} = user;
            memory.addUser(user.name, password, {
                ...userData,
                groups: userGroups.map(ug =>
                    groups.filter(g =>g.groupName === ug && g.enabled)[0]
                ).concat(everyOneGroup)
            })
        });
        return true
    } catch(e) {
        return false
    }
}

fs.watchFile("users.json", (curr, prev) => {
    if(!readUsers()) {
        console.error("Error reading user.json")
    } else {
        console.log("users updated")
    }
});

if(!readUsers()) {
    console.error("Error reading user.json")
    process.exit(1)
}

function getToken(req: express.Request): string {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.toLowerCase().indexOf("bearer ") === 0
        && authHeader.substring("bearer ".length) || "";
}

const authentication = express.Router();

authentication.post('/login', (req, res) => {
    memory.login(req.body.user, req.body.password, {})
        .then((auth) => res.send(auth))
        .catch(() => {
            res.status(403);
            res.send('Invalid credentials');
        });
});

authentication.post('/verify', (req, res) => {
    const token = getToken(req)
    memory.refreshToken(token, token, {})
        .then((auth) => res.send(auth))
        .catch(() => {
            res.status(403);
            res.send('Invalid credentials');
        });
});

authentication.post('/refresh', (req, res) => {
    memory.refreshToken(req.body.accessToken, req.body.refreshToken, {})
        .then((auth) => res.send(auth))
        .catch(() => {
            res.status(403);
            res.send('Invalid tokens');
        });
});

authentication.post('/changePassword', (req, res) => {
    const token = getToken(req)
    memory.refreshToken(token, token, {}).then((auth) => {
        if (auth && auth.User.name === req.body.user.name) {
            memory.changePassword(req.body.user, req.body.newPassword, {})
                .then((auth) => {
                    usersFile.users = usersFile.users.map(u => {
                        if (u.name === req.body.user.name) {
                            return {...u, password: req.body.newPassword}
                        }
                        return u;
                    })
                    fs.writeFileSync("users.json", JSON.stringify(usersFile), {
                        encoding: "utf-8"
                    })
                    res.send(auth)
                })
                .catch(() => {
                    res.status(400);
                    res.send('Cannot change password');
                })
        } else {
            res.status(400);
            res.send('User not matching');
        }
    }).catch(() => {
        res.status(403);
        res.send('Invalid tokens');
    });
});
const Anonymous: UserData = {
    id: 0,
    name: "anonymous",
    enabled: true,
    attribute: [],
    groups: [everyOneGroup],
    role: "GUEST"
}
export function getUser(req: express.Request): Promise<UserData> {
    const token = getToken(req)
    if (token) {
        return memory.refreshToken(token, token, {}).then((auth) => auth.User)
    }
    return Promise.resolve(Anonymous)
}

export default authentication;
