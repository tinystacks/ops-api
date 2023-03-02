#!/bin/bash

# Setup local persistent store
if [ ! -f "store/example.yml" ];
  then
    mkdir -p store;
    cp basicexample.yml store/example.yml;
fi


# Build and run API
NPM_TOKEN=$(cat ~/.npmrc | grep '^//npm.pkg.github.com' | cut -d "=" -f2-);
version=$(cat ./package.json | jq -r .version);
appName=$(cat ./package.json | jq -r .name);
docker network create -d bridge ops-console 2> /dev/null;
docker build \
  --progress plain \
  --build-arg NPM_TOKEN=${NPM_TOKEN} \
  -t "$appName:$version" . || exit 1;
docker container stop $appName || true
docker container rm $appName || true
docker run --name $appName \
  -v $HOME/.aws:/root/.aws \
  -v $(pwd)/store:/config \
  --env CONFIG_PATH="../config/example.yml" \
  --env NODE_ENV=production \
  --env-file ./.env.staging \
  -it \
  -p 8000:8000 \
  --network=ops-console \
  "$appName:$version";