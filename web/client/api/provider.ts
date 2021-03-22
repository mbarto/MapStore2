import ConfigUtils from "../utils/ConfigUtils"

export type ApiProviderType<Api> = {
    addApi: (name: string, apiImplementation: Api) => void
    setApi: (name: string) => void
    getApi: () => Api
}

type Apis<Api> = {
    [key: string]: Api
}

export function createApiProvider<Api>(apiName: string, defaultImplementation: string): ApiProviderType<Api> {
    const apis: Apis<Api> = {}
    let authProviderName: string = defaultImplementation
    return {
        addApi(name, apiImplementation) {
            apis[name] = apiImplementation
        },
        setApi(name) {
            authProviderName = name
        },
        getApi() {
            return apis[ConfigUtils.getConfigProp(apiName) || authProviderName]
        }
    }
}


