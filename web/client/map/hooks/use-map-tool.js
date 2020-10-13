/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {useEffect, useRef, useState} from "react";

/**
 * Hook that can be used to load a tool in an asynchronous way
 * @param {string} mapType the map type
 * @param {string} tool the name of the tool, should match a file in web/client/map/<mapType> folder
 * @return {[boolean, object, object]} [loaded, tool_implementation, error]: loaded is false until the tool has been correctly loaded, tool_implementation is a ReactJS reference to the tool, error is an object containing an error if the tool implementation cannot be loaded
 */
const useMapTool = (mapType = "openlayers", tool = "") => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const impl = useRef();
    useEffect(() => {
        if (mapType && !impl.current) {
            setLoaded(false);
            setError(null);
            import("../" + mapType + "/" + tool)
                .then(toolImpl => {
                    impl.current = toolImpl.default;
                    setLoaded(true);
                })
                .catch((e) => {
                    setError(e);
                });
        }
        return () => {};
    }, [ mapType ]);
    return [loaded, impl.current, error];
};

export default useMapTool;

