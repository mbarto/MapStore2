import Resources from "../index"
import {Resource} from "../api"
import expect from "expect"
import memory from "../memory"

const SAMPLE_RESOURCE1: Resource = {
    id: 1,
    name: "MyMap",
    description: "this is a map",
    category: {
        id: 1,
        name: "MAP"
    },
    creation: "2021-15-03",
    lastUpdate: "2021-15-03",
    canCopy: false,
    canEdit: false,
    canDelete: false,
    Attributes: {
        attribute: [{
            name: "featured",
            "@type": "STRING",
            value: true
        }]
    }
}

const SAMPLE_RESOURCE2: Resource = {
    id: 2,
    name: "MyMap2",
    description: "this is another map",
    category: {
        id: 1,
        name: "MAP"
    },
    creation: "2021-15-03",
    lastUpdate: "2021-15-03",
    canCopy: false,
    canEdit: false,
    canDelete: false,
    Attributes: {
        attribute: [{
            name: "featured",
            "@type": "STRING",
            value: true
        }]
    }
}

const SAMPLE_RESOURCE3: Resource = {
    id: 3,
    name: "MyDashboard",
    description: "this is a dashboard",
    category: {
        id: 2,
        name: "DASHBOARD"
    },
    creation: "2021-15-03",
    lastUpdate: "2021-15-03",
    canCopy: false,
    canEdit: false,
    canDelete: false,
    Attributes: {
        attribute: [{
            name: "featured",
            "@type": "STRING",
            value: true
        }]
    }
}

describe("resources api", () => {
    beforeEach(() => {
        Resources.setApi("memory");
        memory.addResource(SAMPLE_RESOURCE1.id, SAMPLE_RESOURCE1)
        memory.addResource(SAMPLE_RESOURCE2.id, SAMPLE_RESOURCE2)
        memory.addResource(SAMPLE_RESOURCE3.id, SAMPLE_RESOURCE3)
    })
    afterEach(() => {
        Resources.setApi("geostore");
        memory.clear()
    })
    it("search by attribute success", (done) => {
        Resources.searchListByAttributes({
            AND: {
                ATTRIBUTE: [{
                    name: ["featured"],
                    operator: ["EQUAL_TO"],
                    type: ["STRING"],
                    value: [true]
                }]
            }
        }, {params: {
            start: 0,
            limit: 3
        }}).then(result => {
            expect(result.ExtResourceList.ResourceCount).toBe(3);
            done()
        })
    })
    it("search by attribute and keyword", (done) => {
        Resources.searchListByAttributes({
            AND: {
                ATTRIBUTE: [{
                    name: ["featured"],
                    operator: ["EQUAL_TO"],
                    type: ["STRING"],
                    value: [true]
                }],
                FIELD: [{
                    field: ["NAME"],
                    operator: ["ILIKE"],
                    value: ["%another%"]
                }]
            }
        }, {params: {
            start: 0,
            limit: 3
        }}).then(result => {
            expect(result.ExtResourceList.ResourceCount).toBe(1);
            done()
        })
    })
    it("search by attribute limit", (done) => {
        Resources.searchListByAttributes({
            AND: {
                ATTRIBUTE: [{
                    name: ["featured"],
                    operator: ["EQUAL_TO"],
                    type: ["STRING"],
                    value: [true]
                }]
            }
        }, {params: {
            start: 0,
            limit: 1
        }}).then(result => {
            expect(result.ExtResourceList.ResourceCount).toBe(1);
            done()
        })
    })
    it("search by attribute none", (done) => {
        Resources.searchListByAttributes({
            AND: {
                ATTRIBUTE: [{
                    name: ["featured"],
                    operator: ["EQUAL_TO"],
                    type: ["STRING"],
                    value: [false]
                }]
            }
        }, {params: {
            start: 0,
            limit: 3
        }}).then(result => {
            expect(result.ExtResourceList.ResourceCount).toBe(0);
            done()
        })
    })
    it("get resources by category, all", (done) => {
        Resources.getResourcesByCategory("MAP", "*", {
            params: {
                start: 0,
                limit: 3
            }
        }).then(result => {
            expect(result.totalCount).toBe(2);
            done()
        })
    })
    it("get resources by category, keyword", (done) => {
        Resources.getResourcesByCategory("MAP", "another", {
            params: {
                start: 0,
                limit: 3
            }
        }).then(result => {
            expect(result.totalCount).toBe(1);
            done()
        })
    })
    it("get resources by category, keyword not found", (done) => {
        Resources.getResourcesByCategory("MAP", "that", {
            params: {
                start: 0,
                limit: 3
            }
        }).then(result => {
            expect(result.totalCount).toBe(0);
            done()
        })
    })
    it("get resources by category, with limits", (done) => {
        Resources.getResourcesByCategory("MAP", "*", {
            params: {
                start: 0,
                limit: 1
            }
        }).then(result => {
            expect(result.totalCount).toBe(1);
            done()
        })
    })
})
