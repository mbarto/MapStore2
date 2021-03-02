module.exports = function(api) {
    api.cache(true);
    return {
        "presets": [
            "@babel/env",
            "@babel/preset-react",
            "@babel/preset-typescript"
        ],
        "plugins": [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import"
        ]
    };
};
