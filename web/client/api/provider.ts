import ConfigUtils from "../utils/ConfigUtils"

export type ApiProviderType<Api> = {
    addApi: (name: string, apiImplementation: Api) => void
    setApi: (name: string) => void
    getApi: () => Api
}

type Apis<Api> = {
    [key: string]: Api
}

export class ApiProvider<Api> implements ApiProviderType<Api> {
    private apis: Apis<Api> = {}
    private authProviderName: string = ""
    public apiName: string = ""
    constructor(apiName: string, defaultName: string) {
        this.apiName = apiName
        this.authProviderName = defaultName
    }
    addApi(name: string, apiImplementation: Api) {
        this.apis[name] = apiImplementation
    }
    setApi(name: string) {
        this.authProviderName = name
    }
    getApi() {
        return this.apis[ConfigUtils.getConfigProp(this.apiName) || this.authProviderName]
    }
}
