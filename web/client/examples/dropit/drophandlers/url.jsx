const axios = require('../../../libs/ajax');

module.exports = (app) => ({
    canHandle() {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: -1
            });
        });
    },
    canHandleText(text) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: text.match(/^http(s)?:\/\/.*$/) ? 10 : -1
            });
        });
    },
    handleText(url) {
        axios.get(url).then((response) => {
            debugger;
        });
    }
});
