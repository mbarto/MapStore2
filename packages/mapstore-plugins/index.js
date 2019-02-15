import * as PluginsUtils from '../../web/client/utils/PluginsUtils';
import Map from '../../web/client/plugins/Map';

import PluginsContainer from '../../web/client/components/plugins/PluginsContainer';

export {PluginsContainer};

export default {...PluginsUtils,
    plugins: {
        Map
    }
};
