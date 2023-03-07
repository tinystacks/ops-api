#!/bin/bash

# Start fresh
npm run clean;

# Setup local persistent store
if [ ! -f "store/example.yml" ];
  then
    mkdir -p store;
    cp basicexample.yml store/example.yml;
fi

# Build and run API
npm run build;
CONFIG_PATH="./store/example.yml" NODE_ENV=dev node ./dist/server.js