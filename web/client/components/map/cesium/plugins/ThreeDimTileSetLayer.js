import Layers from '../../../../utils/cesium/Layers';
import * as Cesium from 'Cesium';

Layers.registerType('3dtileset', {
    create: (options, map) => {
        if (options.visibility) {
            const tileSet = map.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: options.url
            }));
            map.zoomTo(tileSet, new Cesium.HeadingPitchRange(0, -0.5, 0));
            return {
                detached: true,
                tileSet,
                remove: () => {
                    map.scene.primitives.remove(tileSet);
                }
            };
        }
        return null;
    },
    update: function(layer, newOptions, oldOptions, map) {
        if (!newOptions.visibility && oldOptions.visibility) {
            layer.remove();
        } else if (newOptions.visibility && !oldOptions.visibility) {
            return  this.create(newOptions, map);
        }
        return null;
    }
});
