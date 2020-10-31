# Stage 0 - npm install
FROM node:12.13.1-slim AS deps

COPY package.json /app/
COPY package-lock.json /app/
WORKDIR /app
RUN npm install
COPY . /app

# Stage 1 - test & build & lint
FROM node:12.13.1-slim AS build
COPY --from=deps /app/ /app
WORKDIR /app
RUN npm run compile

FROM tomcat:8.5-jdk8-openjdk
COPY --from=deps /app/ /app
WORKDIR /app
RUN mvn clean install
