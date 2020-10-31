FROM tomcat:8.5-jdk8-openjdk

# Tomcat specific options
ENV CATALINA_BASE "$CATALINA_HOME"
ENV JAVA_OPTS="${JAVA_OPTS}  -Xms512m -Xmx512m -XX:MaxPermSize=128m"

# Optionally remove Tomcat manager, docs, and examples
ARG TOMCAT_EXTRAS=false
RUN if [ "$TOMCAT_EXTRAS" = false ]; then \
      find "${CATALINA_BASE}/webapps/" -delete; \
    fi

# Add war files to be deployed
COPY web/target/mapstore.war "${CATALINA_BASE}/webapps/"

# Set variable to better handle terminal commands
ENV TERM xterm

EXPOSE 8080
