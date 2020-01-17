/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
package it.geosolutions.mapstore;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;
import java.util.Properties;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Stream;
import javax.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import net.sf.json.JSONObject;

@Controller
public class ConfigController {
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
    
    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    public class ResourceNotAllowedException extends RuntimeException {
        public ResourceNotAllowedException(String message) {
            super(message);
        }
    }
    
    @Value("${datadir.location:}") private String dataDir;
    @Value("${allowed.resources:localConfig,pluginsConfig,extensions}") private String allowedResources;
    @Value("${overrides.mappings:}") private String mappings;
    @Value("${overrides.config:}") private String overrides;
    
    @Autowired
    ServletContext context;
    
    @RequestMapping(value="/load/{resource}", method = RequestMethod.GET)
    public @ResponseBody String loadResource(@PathVariable("resource") String resourceName, @RequestParam(value="overrides", defaultValue="true") boolean applyOverrides) throws IOException {
        if (isAllowed(resourceName)) {
            return readResource(resourceName + ".json", applyOverrides);
        }
        throw new ResourceNotAllowedException("Resource is not allowed");
    }

    private Optional<String> findExisting(String[] candidates) {
        return Stream.of(candidates)
        .filter(new Predicate<String>() {
            @Override
            public boolean test(String path) {
                return new File(path).exists();
            }
            
        })
        .findFirst();
    }
    
    private String readResource(String resourceName, boolean applyOverrides) throws IOException {
        Optional<String> resource = findExisting(new String[] {dataDir + "/" + resourceName, context.getRealPath(resourceName)});
        if (!resource.isPresent()) {
            throw new ResourceNotFoundException(resourceName);
        }
        return readResourceFromFile(resource.get(), applyOverrides);
    }

    private String readResourceFromFile(String filePath, boolean applyOverrides) throws IOException {
        
        try (Stream<String> stream =
                Files.lines( Paths.get(filePath), StandardCharsets.UTF_8); ) {
            Properties props = readOverrides();
            if (applyOverrides && !"".equals(mappings) && props != null) {
                return resourceWithOverrides(stream, props);
            }
            StringBuilder contentBuilder = new StringBuilder();
            stream.forEach(new Consumer<String>() {
                @Override
                public void accept(String s) {
                    contentBuilder.append(s).append("\n");
                }
            });
            return contentBuilder.toString();
        }
        
    }

    private String resourceWithOverrides(Stream<String> stream, Properties props) {
        JSONObject jsonObject = readJsonConfig(stream);
        for(String mapping : mappings.split(",")) {
            fillMapping(mapping, props, jsonObject);
        }
        return jsonObject.toString();
    }
    
    private Properties readOverrides() throws FileNotFoundException, IOException {
        if (!"".equals(overrides)) {
            Optional<String> resource = findExisting(new String[] {dataDir + "/" + overrides, context.getRealPath(overrides)});
            if (resource.isPresent()) {
                try (FileReader reader = new FileReader(resource.get())) {
                    Properties props = new Properties();
                    props.load(reader);
                    return props;
                }
            }
        }
        return null;
    }

    private JSONObject readJsonConfig(Stream<String> stream) {
        StringBuilder contentBuilder = new StringBuilder();
        stream.forEach(new Consumer<String>() {
            @Override
            public void accept(String s) {
                contentBuilder.append(s).append("\n");
            }
        });
        String json = contentBuilder.toString();
        JSONObject jsonObject = JSONObject.fromObject( json );
        return jsonObject;
    }
    
    private void fillMapping(String mapping, Properties props, JSONObject jsonObject) {
        String[] parts = mapping.split("=");
        if (parts.length != 2 || parts[0].trim().isEmpty() || parts[1].trim().isEmpty()) {
            // LOGGER.warn("Mapping incorrectly specified: " + mapping + ", ignoring");
        } else {
            String path = parts[0];
            String propName = parts[1];
            String value = props.getProperty(propName, "");
            setJsonProperty(jsonObject, path.split("\\."), value);
        }
    }
    
    private void setJsonProperty(JSONObject jsonObject, String[] path, String value) {
        if(path.length == 0) {
            return;
        }
        if(path.length == 1) {
            if (jsonObject.containsKey(path[0])) {
                jsonObject.replace(path[0], value);
            } else {
                jsonObject.element(path[0], value);
            }
        } else {
            String[] newPath = Arrays.copyOfRange(path, 1, path.length);
            JSONObject rootObject;
            if (jsonObject.containsKey(path[0])) {
                if (jsonObject.get(path[0]) instanceof JSONObject) {
                    rootObject = jsonObject.getJSONObject(path[0]);
                } else {
                    jsonObject.replace(path[0], new JSONObject());
                    rootObject = jsonObject.getJSONObject(path[0]);
                }
            } else {
                rootObject = new JSONObject();
                jsonObject.element(path[0], rootObject);
            }
            setJsonProperty(rootObject, newPath, value);
        }
        
    }

    private boolean isAllowed(String resourceName) {
        return Stream.of(allowedResources.split(",")).anyMatch(new Predicate<String>() {
            @Override
            public boolean test(String p) {
                return p.equals(resourceName);
            }
            
        });
    }
}
