const {endsWith} = require('lodash');
const ThemeUtils = require('../../../utils/ThemeUtils');
const FileUtils = require('../../../utils/FileUtils');
const { success } = require('../../../actions/notifications');

const replaceTheme = (style, app) => {
    app.currentStyle = style.split('\n').reduce((previous, current) => {
        const [varName] = current.split(':');
        return previous.replace(new RegExp("\\s*" + varName + "\\s*:.*?;", "g"), '\n' + current + '\n');
    }, app.currentStyle);
    return app.currentStyle;
};

module.exports = (app) => ({
    name: 'Style',
        canHandle(file) {
        return new Promise((resolve) => {
            resolve({
                handler: this,
                priority: endsWith(file.name.toLowerCase(), '.less') || endsWith(file.name.toLowerCase(), '.css') ? 10 : -1
            });
        });
    },
    canHandleText(text) {
        return new Promise((resolve) => {
            ThemeUtils.compileFromLess(text, 'themes/default/', (css, e) => {
                if (e) {
                    resolve({
                        handler: this,
                        priority: -1
                    });
                }
                resolve({
                    handler: this,
                    priority: 10
                });
            });
        });
    },
    handle(file) {
        FileUtils.readText(file)
            .then((style) => {

                ThemeUtils.compileFromLess(style, 'themes/default/', (css) => {
                    if (style.indexOf('@ms2-') !== -1) {
                        app.store.dispatch(success({
                            title: 'Changed Theme',
                            message: 'Page Theme replaced'
                        }));
                        document.getElementById('custom_theme').innerText = css;
                    } else {
                        const styleEl = document.createElement("style");
                        document.head.appendChild(styleEl);
                        styleEl.innerText = css;
                        app.store.dispatch(success({
                            title: 'CSS updated',
                            message: 'New CSS applied to the page!'
                        }));
                    }
                });
            });
    },
    handleText(styleText) {
        const style = styleText.indexOf('@ms2-') !== -1 ? (styleText.indexOf('@import') !== -1 ? styleText : replaceTheme(styleText, app)) : styleText;
        ThemeUtils.compileFromLess(style, 'themes/default/', (css) => {
            if (style.indexOf('@ms2-') !== -1) {
                app.store.dispatch(success({
                    title: 'Changed Theme',
                    message: 'Page Theme replaced!'
                }));
                document.getElementById('custom_theme').innerText = css;
            } else {
                const styleEl = document.createElement("style");
                document.head.appendChild(styleEl);
                styleEl.innerText = css;
                app.store.dispatch(success({
                    title: 'CSS updated',
                    message: 'New CSS applied to the page!'
                }));
            }
        });
    }
});
