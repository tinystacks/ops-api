# Setup local persistent store
if [ ! -f "store/example.yml" ];
  then
    mkdir -p store;
    cp example.yml store/example.yml;
fi

# Build and run API
version=$(cat ./package.json | jq -r .version);
appName=$(cat ./package.json | jq -r .name);
docker build -t "$appName:$version" . || exit 1;
docker container stop $appName || true
docker container rm $appName || true
docker run --name $appName -v $HOME/.aws:/root/.aws -v $(pwd)/store:/config --env CONFIG_PATH="../config/example.yml" --env NODE_ENV=dev -it -p 8000:8000 "$appName:$version";