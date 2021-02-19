# Persistence API

```typescript
type Attribute = {
    name: string
    value: string
}

type Resource = {
    id: number
    name: string
    attributes?: Attribute[]
    data?: object
    category?: string
    metadata?: object
    permission?: object
}

type ResourceGraph = Resource && {
    linkedResources: Resource[]
}

type ResourceQueryOptions = {
    includeAttributes: boolean
    withData: boolean
    withPermissions:boolean
}

type PagingOptions = {
    params: {
        start: number
        limit: number
    }
}

type ResourcesQuery = {
    query: string // "*"
    category: string
    options:  ResourceQueryOptions && PagingOptions // false, false, false, 0, 10
}

type JSONFilter = {

}

/**
 *  examples of filters found in the code
 * {
    AND: {
        ...searchObj,
        ATTRIBUTE: [
            {
                name: ['featured'],
                operator: ['EQUAL_TO'],
                type: ['STRING'],
                value: [true]
            }
        ]
    }

    AND: {
        FIELD: {
            field: ['NAME'],
            operator: ['EQUAL_TO'],
            value: [contextName]
        }
    }

    AND: {
        FIELD: [{
            field: ['NAME'],
            operator: ['ILIKE'],
            value: ['%' + actualSearchText + '%']
        }],
        OR: {
            ATTRIBUTE: (searchFilter.contexts || []).map(context => ({
                name: ['context'],
                operator: ['EQUAL_TO'],
                type: ['STRING'],
                value: [context.id]
            }))
        }

        OR: {
            FIELD: templates.map(template => ({
                field: ['ID'],
                operator: ['EQUAL_TO'],
                value: [template.id]
            }))
        }
    }
 */

function getResource(id: number, options: ResourceQueryOptions): Promise<Resource>

function getResourceIdByName(category: string, name: string): Promise<number>

function getResourceDataByName(category: string, name: string): Promise<object>

function getResources(query: ResourcesQuery): Promise<Resource[]>

function createResource(resource: ResourceGraph): unknown

function updateResource(resource: ResourceGraph): unknown

function updateResourceAttribute({ id: number } && Attribute): unknown

function deleteResource({id: number}, {deleteLinkedResources: boolean = true}): unknown

function createCategory(category: name): unknown

function searchListByAttributes(filter: JSONFilter, options: ResourceQueryOptions && PagingOptions): Promise<Resource[]>

```
