export type ResourcesQuery = string
export type ResourcesOptions = {
    params: {
        includeAttributes?: boolean
        withData?: boolean
        withPermission?: boolean
        start: number
        limit: number
    }
}

export type FilterOperator = "EQUAL_TO" | "ILIKE"
export type AttributeType = "STRING"
export type AttributeValue = boolean | string

export type ResourcesByAttributeFilter = {
    name: string[],
    operator: FilterOperator[],
    type: AttributeType[],
    value: AttributeValue[]
}

export type ResourceByFieldFilter = {
    field: string[],
    operator: FilterOperator[],
    value: AttributeValue[]
}

export type ResourcesFilter = {
    AND: {
        ATTRIBUTE: ResourcesByAttributeFilter[],
        FIELD?: ResourceByFieldFilter[]
    }
}

export type Category = {
    id: number
    name: string
}

export type Attribute = {
    "@type": AttributeType
    name: string
    value: AttributeValue
}

export type Resource = {
    id: number
    name: string
    description: string
    Attributes?: {
        attribute: Attribute[]
    }
    category?: Category
    creation: string
    lastUpdate: string
    canCopy?: boolean
    canDelete?: boolean
    canEdit?: boolean
}

export type SearchByAttributesResult = {
    ExtResourceList: {
        Resource: Resource | Resource[]
        ResourceCount: number
    }
}

export type ListResult = {
    success: boolean
    totalCount: number
    results: Resource | Resource[]
}

export type ResourcesApi = {
    getResourcesByCategory: (category: string, query: ResourcesQuery, options: ResourcesOptions) => Promise<ListResult>
    searchListByAttributes: (filter: ResourcesFilter, options: ResourcesOptions, url?: string) => Promise<SearchByAttributesResult>
};

