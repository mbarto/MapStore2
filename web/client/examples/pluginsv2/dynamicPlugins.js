import capitalize from 'lodash/capitalize';

export default (plugin, callback) => {
    import(/* webpackChunkName: "plugins/[request]" */`./plugins/${plugin}/index`).then((pluginDef) => {
        callback(capitalize(plugin), pluginDef && pluginDef.default || pluginDef);
    });
};
