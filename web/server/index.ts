import {UserData} from "../client/api/authentication";
import memory from "../client/api/authentication/memory";
import express from 'express';
import cors from "cors";

const USERNAME = "user";

const SAMPLE_USER: UserData = {
    id: 1,
    name: USERNAME,
    enabled: true,
    attribute: [],
    role: "USER",
    groups: []
};

memory.addUser(USERNAME, "password", SAMPLE_USER);

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
app.post('/rest/node/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.toLowerCase().indexOf("bearer ") === 0
        && authHeader.substring("bearer ".length) || "";
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
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
