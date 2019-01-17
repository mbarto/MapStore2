const React = require('react');
const MapInfoUtils = require('../utils/MapInfoUtils');
const Viewer = require('./customidentifyviewer/Viewer');

class CustomIdentifyViewer extends React.Component {
    componentWillMount() {
        MapInfoUtils.setViewer('CUSTOM', {
            "application/json": Viewer
        });
    }
    render() {
        return null;
    }
}

module.exports = {
    CustomIdentifyViewerPlugin: CustomIdentifyViewer
};
