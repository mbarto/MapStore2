import React from 'react';
import {createPlugin} from '../../../../utils/PluginsUtils';
import {Button} from 'react-bootstrap';

import {doClick} from './actions/lazy';
import lazy from './reducers/lazy';

const LazyCmp = () => {
    return <Button style={{position: "absolute", zIndex: 10000}} onClick={doClick}>Click me 2!</Button>;
};

export default createPlugin("Lazy2", {
    component: LazyCmp,
    reducers: {
        lazy
    }
});

