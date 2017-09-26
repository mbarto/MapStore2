var markerIcon = require('./img/marker-icon.png');
var markerShadow = require('./img/marker-shadow.png');
var ol = require('openlayers');

const assign = require('object-assign');

const MarkerUtils = require('../../../utils/MarkerUtils');
const markers = MarkerUtils.extraMarkers;
const extraMarker = markers.icons[0];
const extraMarkerShadow = markers.icons[1];

const glyphs = MarkerUtils.getGlyphs('fontawesome');

const image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

const defaultStyles = {
  'Point': () => [new ol.style.Style({
      image: image
  })],
  'LineString': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiLineString': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiPoint': () => [new ol.style.Style({
    image: image
  })],
  'MultiPolygon': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'Polygon': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'GeometryCollection': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'magenta'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'magenta'
      })
    })
  })],
  'Circle': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
})],
  'marker': (options) => [new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [14, 41],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: markerShadow
    })
}), new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: markerIcon
    }),
    text: new ol.style.Text({
        text: options.label,
        scale: 1.25,
    offsetY: 8,
        fill: new ol.style.Fill({color: '#000000'}),
        stroke: new ol.style.Stroke({color: '#FFFFFF', width: 2})
    })
    })]
};

var styleFunction = function(feature, options) {
    return defaultStyles[feature.getGeometry().getType()](options);
};

function getMarkerStyle(options) {
    let markerStyle;
    if (options.style.iconUrl) {
        markerStyle = [new ol.style.Style({
              image: new ol.style.Icon(({
                anchor: options.iconAnchor || [0.5, 1],
                anchorXUnits: ( options.iconAnchor || options.iconAnchor === 0) ? 'pixels' : 'fraction',
                anchorYUnits: ( options.iconAnchor || options.iconAnchor === 0) ? 'pixels' : 'fraction',
                src: options.style.iconUrl
            }))
        })];
        if (options.style.shadowUrl) {
            markerStyle = [new ol.style.Style({
                  image: new ol.style.Icon(({
                    anchor: [12, 41],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    src: options.style.shadowUrl || markerShadow
                  }))
              }), markerStyle [0]];
        }
    } else {
        markerStyle = [new ol.style.Style({
              image: new ol.style.Icon(({
                anchor: [12, 12],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: extraMarkerShadow
            }))
        }), new ol.style.Style({
            image: new ol.style.Icon(({
                src: extraMarker,
                anchor: [markers.size[0] / 2, markers.size[1]],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                size: markers.size,
                offset: [markers.colors.indexOf(options.style.iconColor || 'blue') * markers.size[0], markers.shapes.indexOf(options.style.iconShape || 'circle') * markers.size[1]]
            })),
            text: new ol.style.Text({
                text: glyphs[options.style.iconGlyph],
                font: '14px FontAwesome',
                offsetY: -markers.size[1] * 2 / 3,
                fill: new ol.style.Fill({color: '#FFFFFF'})
            })
        })].concat(options.style.highlight ? [new ol.style.Style({
            text: new ol.style.Text({
                text: '\ue165',
                font: '18px mapstore2',
                offsetY: -markers.size[1] - 10,
                fill: new ol.style.Fill({color: '#FF00FF'})
            })
        })] : []);
    }
    return markerStyle;
}

function getStyle(options) {
    let style = options.nativeStyle;
    if (!style && options.style) {
        style = {
            stroke: new ol.style.Stroke( options.style.stroke ? options.style.stroke : {
                color: 'blue',
                width: 1
            }),
            fill: new ol.style.Fill(options.style.fill ? options.style.fill : {
                color: 'blue'
            })
        };

        if (options.style.type === "Point") {
            style = {
                image: new ol.style.Circle(assign({}, style, {radius: options.style.radius || 5}))
            };
        }
        if (options.style.iconUrl || options.style.iconGlyph) {
            const markerStyle = getMarkerStyle(options);

            style = function(f) {
                var feature = this || f;
                const type = feature.getGeometry().getType();
                switch (type) {
                    case "Point":
                    case "MultiPoint":
                        return markerStyle;
                    default:
                        return styleFunction(feature);
                }
            };
        } else {
            style = new ol.style.Style(style);
        }
    }
    return (options.styleName && !options.overrideOLStyle) ? (feature) => {
        if (options.styleName === "marker") {
            const type = feature.getGeometry().getType();
            switch (type) {
                case "Point":
                case "MultiPoint":
                    return defaultStyles.marker(options);
                default:
                    break;
            }
        }
        return defaultStyles[options.styleName](options);
    } : style || styleFunction;
}
module.exports = {
    getStyle,
    getMarkerStyle,
    styleFunction
};
