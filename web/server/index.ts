import {UserData, Group} from "../client/api/authentication";
import memory from "../client/api/authentication/memory";
import express from 'express';
import cors from "cors";
import fs from "fs";

type UserWithCredentials = Omit<UserData, "groups"> & {
    password: string,
    groups: string[]
}

type UsersFile = {
    users: UserWithCredentials[],
    groups: Group[]
}

const everyOneGroup: Group = {
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

const app = express();
app.use(express.json());
app.use(cors())

const PORT = 8000;
app.post('/rest/node/login', (req, res) => {
    memory.login(req.body.user, req.body.password, {})
        .then((auth) => res.send(auth))
        .catch(() => {
            res.status(403);
            res.send('Invalid credentials');
        });
});

function getToken(req: express.Request): string {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.toLowerCase().indexOf("bearer ") === 0
        && authHeader.substring("bearer ".length) || "";
}

app.post('/rest/node/verify', (req, res) => {
    const token = getToken(req)
    memory.refreshToken(token, token, {})
        .then((auth) => res.send(auth))
        .catch(() => {
            res.status(403);
            res.send('Invalid credentials');
        });
});
app.post('/rest/node/refresh', (req, res) => {
    memory.refreshToken(req.body.accessToken, req.body.refreshToken, {})
        .then((auth) => res.send(auth))
        .catch(() => {
            res.status(403);
            res.send('Invalid tokens');
        });
});
app.post('/rest/node/changePassword', (req, res) => {
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
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
