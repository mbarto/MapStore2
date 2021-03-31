import fs from "fs";
import express from "express";
import memory from "../client/api/resources/memory";
import { Category, ListResult, Resource } from "../client/api/resources/api";
import { Group, UserData } from "../client/api/authentication/api";
import { everyOneGroup, getUser } from "./authentication";
import { truncate } from "lodash";

const catalogFolder = "catalog"

type UserPermissionOwner = {
    type: "user",
    user: string
}

type GroupPermissionOwner = {
    type: "group",
    group: string
}

type PermissionOwner = UserPermissionOwner | GroupPermissionOwner

type Permission = {
    owner: PermissionOwner
    canRead: boolean
    canWrite: boolean
    canAdmin: boolean
}

type StoredResource = Omit<Resource, "canDelete" | "canEdit" | "canCopy"> & {
    permissions: Permission[]
    owner: string
}

type ResourcesCatalog = {
    resources: StoredResource[]
}

type MetadataFile = Omit<StoredResource, "category" | "id">

let resourcesCatalog: ResourcesCatalog;

function createCategory(id: number, name: string): Category {
    return {
        id,
        name
    }
}

function createResource(id: number, category: Category): StoredResource {
    let metadataFile : MetadataFile
    metadataFile = JSON.parse(fs.readFileSync(`${catalogFolder}/${category.name}/${id}/metadata.json`, {
        encoding: "utf-8"
    }))
    return {
        id,
        category,
        ...metadataFile
    }
}

function browseResources(resources: StoredResource[], category: Category): StoredResource[] {
    return [...resources, ...fs.readdirSync(`${catalogFolder}/${category.name}`, {
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
        resourcesCatalog = browseCatalog(catalogFolder)

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

function isEveryOne(permission: Permission) {
    if (permission.owner.type === "group") {
        return permission.owner.group === everyOneGroup.groupName
    }
    return false
}

function matchesUser(name: string, p: Permission): boolean {
    if (p.owner.type === "user") {
        return p.owner.user === name
    }
    return false
}

function matchesGroup(groups: Group[], p: Permission): boolean {
    return groups.some(g => p.owner.type === "group" && g.groupName === p.owner.group)
}

function matchingPermissions(user: UserData, permissions: Permission[]) {
    return permissions.filter(p =>
        isEveryOne(p)
        || matchesUser(user.name, p)
        || matchesGroup(user.groups, p)
    )
}

function canRead(user: UserData, resource: StoredResource) {
    return resource.owner === user.name
        || user.role === "ADMIN"
        || matchingPermissions(user, resource.permissions).some(p => p.canRead)
}

function canEdit(user: UserData, resource: StoredResource) {
    return resource.owner === user.name
        || user.role === "ADMIN"
        || matchingPermissions(user, resource.permissions).some(p => p.canWrite)
}

function canAdmin(user: UserData, resource: StoredResource) {
    return resource.owner === user.name
        || user.role === "ADMIN"
        || matchingPermissions(user, resource.permissions).some(p => p.canAdmin)
}

function addPermissions(user: UserData, resource: Resource) {
    return {
        ...resource,
        canEdit: canEdit(user, resource as StoredResource),
        canCopy: canEdit(user, resource as StoredResource),
        canDelete: canAdmin(user, resource as StoredResource)
    }
}

function filterByUser(resources: ListResult, user: UserData): ListResult {
    const filtered = resources.results.filter(r => canRead(user, r as StoredResource))
    return {
        ...resources,
        results: filtered.map(r => addPermissions(user, r)),
        totalCount: filtered.length
    }
}

function paginate(resources: ListResult, start: number, limit: number) {
    return {
        ...resources,
        results: resources.results.filter((r, i) => i>=start && i<start+limit)
    }
}

resources.get('/search/category/:category/:query', (req, res) => {
    getUser(req).then(u => memory.getResourcesByCategory(req.params.category, req.params.query, {
        params: {
            start: 0,
            limit: Number.MAX_VALUE
        }
    })
        .then((resources) => filterByUser(resources, u)))
        .then((resources) => paginate(resources, Number(req.query.start), Number(req.query.limit)))
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


