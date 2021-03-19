import {ResourcesApi, Resource, Category, ResourcesFilter, ResourcesByAttributeFilter, ResourcesOptions, ResourceByFieldFilter} from "./api"

const categories = new Map<string, Category>();
["MAP", "DASHBOARD", "CONTEXT", "GEOSTORY"].forEach((c, index) => categories.set(c, {
    id: index,
    name: c
}));

const resources = new Map<number, Resource>();

type MemoryAPI = {
    addResource(id: number, resource: Resource): void
    clear(): void
}

function applyFilter(filter: ResourcesFilter, resource: Resource): boolean {
    return filter.AND.ATTRIBUTE.reduce((result: boolean, attribute: ResourcesByAttributeFilter): boolean => {
        return result || (resource.Attributes?.attribute.some(a => a.name === attribute.name[0] && a.value === attribute.value[0]) ?? false)
    }, false) && (!filter.AND.FIELD || filter.AND.FIELD?.reduce((result: boolean, field: ResourceByFieldFilter): boolean => {
        const keyword = field.value[0].toString().toLowerCase().substring(1, field.value[0].toString().length - 1);
        return result || (resource.name.toLowerCase().indexOf(keyword) !== -1) ||
            (resource.description.toLowerCase().indexOf(keyword) !== -1) ;
    }, false));
}

function filterByAttributes(filter: ResourcesFilter): Resource[] {
    return Array.from(resources.values()).filter(r =>applyFilter(filter, r))
}

function applyOptions(resources: Resource[], options: ResourcesOptions) {
    return resources.filter((r, index) => index>= options.params.start && index < options.params.start + options.params.limit);
}

function filterByCategory(category: string): Resource[] {
    return Array.from(resources.values()).filter(r => r.category?.name === category);
}

function filterByKeyword(current: Resource[], keyword: string): Resource[] {
    return current.filter(r => keyword === "*" ||
        r.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
        r.description.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    );
}

const memoryAPI : ResourcesApi & MemoryAPI = {
    addResource(id, resource) {
        resources.set(id, resource);
    },
    clear() {
        resources.clear();
    },
    getResourcesByCategory(category, query, options) {
        const results = applyOptions(filterByKeyword(filterByCategory(category), query), options);
        return Promise.resolve({
            success: true,
            totalCount: results.length,
            results
        });
    },
    searchListByAttributes(filter, options) {
        const result = applyOptions(filterByAttributes(filter), options);
        return Promise.resolve({
            ExtResourceList: {Resource: result, ResourceCount: result.length},
        });
    }
}

export default memoryAPI;
