import fs from "fs";
import express from "express";
import memory from "../client/api/resources/memory";
import { Category, Resource } from "../client/api/resources/api";

type ResourcesCatalog = {
    resources: Resource[]
}

type MetadataFile = Omit<Resource, "category" | "id">

let resourcesCatalog: ResourcesCatalog;

function createCategory(id: number, name: string): Category {
    return {
        id,
        name
    }
}

function createResource(id: number, category: Category): Resource {
    let metadataFile : MetadataFile
    metadataFile = JSON.parse(fs.readFileSync(`catalog/${category.name}/${id}/metadata.json`, {
        encoding: "utf-8"
    }))
    return {
        id,
        category,
        ...metadataFile
    }
}

function browseResources(resources: Resource[], category: Category): Resource[] {
    return [...resources, ...fs.readdirSync(`catalog/${category.name}`, {
        encoding: "utf-8",
        withFileTypes: true
    }).filter(ent => ent.isDirectory())
    .map(ent => createResource(Number(ent.name), category))]
}

function browseCatalog(folder: string): ResourcesCatalog {
    return {
        resources: fs.readdirSync(folder, {
            encoding: "utf-8",
            withFileTypes: true
        }).filter(ent => ent.isDirectory())
        .map((ent, index) => createCategory(index + 1, ent.name))
        .reduce(browseResources, [])
    }
}

function readResources(): boolean {
    try {
        resourcesCatalog = browseCatalog("catalog")

        const {resources} = resourcesCatalog;
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
