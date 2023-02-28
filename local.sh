#!/bin/bash

# Setup local persistent store
if [ ! -f "store/example.yml" ];
  then
    mkdir -p store;
    cp basicexample.yml store/example.yml;
fi


# Build and run API
npm run clean;
npm run build;
CONFIG_PATH="./store/example.yml" NODE_ENV=dev node ./dist/server.js