import fs from "fs";
import express from "express";
import memory from "../client/api/resources/memory";
import { Resource } from "../client/api/resources";

type ResourcesFile = {
    resources: Resource[]
}

let resourcesFile: ResourcesFile;

function readResources(): boolean {
    try {
        resourcesFile = JSON.parse(fs.readFileSync("resources.json", {
            encoding: "utf-8"
        }))
        const {resources} = resourcesFile;
        memory.clear()
        resources.forEach(resource => {
            memory.addResource(resource.id, resource)
        });
        return true
    } catch(e) {
        return false
    }
}

fs.watchFile("resources.json", (curr, prev) => {
    if(!readResources()) {
        console.error("Error reading resources.json")
    } else {
        console.log("resources updated")
    }
});

if(!readResources()) {
    console.error("Error reading resources.json")
    process.exit(1)
}

const resources = express.Router();

resources.get('/search/category/:category/:query', (req, res) => {
    memory.getResourcesByCategory(req.params.category, req.params.query, {
        params: {
            start: Number(req.query.start),
            limit: Number(req.query.limit)
        }
    })
        .then((resources) => res.send(resources))
        .catch(() => {
            res.status(500);
            res.send('Server error');
        });
});

resources.post("/search/list", (req, res) => {
    memory.searchListByAttributes(req.body.filter, {
        params: {
            start: Number(req.query.start),
            limit: Number(req.query.limit)
        }
    }).then((resources) => res.send(resources))
    .catch(() => {
        res.status(500);
        res.send('Server error');
    });
});

export default resources;
