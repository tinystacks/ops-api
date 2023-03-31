#!/bin/bash

# Start fresh
npm run clean;

# Setup local persistent store
if [ ! -f "store/example.yml" ];
  then
    mkdir -p store;
    cp basicexample.yml store/example.yml;
fi

dependencies=$(bash ./get-runtime-dependencies.sh);

# Build and run API
npm i --no-save --silent $dependencies --@tinystacks:registry=https://registry.npmjs.org
npm run build;
CONFIG_PATH="./store/example.yml" NODE_ENV=dev node --experimental-import-meta-resolve ./dist/server.js