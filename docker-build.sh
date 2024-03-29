version=$(cat ./package.json | jq -r .version);
appName=$(cat ./package.json | jq -r .name);
docker build -t "$appName:$version" -t "$appName:latest" . || exit 1;