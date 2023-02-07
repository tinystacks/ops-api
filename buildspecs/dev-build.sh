#!/bin/bash

callerIdentity=$(aws sts get-caller-identity);
accountId=$(jq -r .Account <<< $callerIdentity);
version=$(cat ./package.json | jq -r .version);
appName=$(cat ./package.json | jq -r .name);
commitSha=$(git rev-parse HEAD);
region="${AWS_REGION:-us-east-1}";
ecrEndpoint="${accountId}.dkr.ecr.${region}.amazonaws.com";
ecrImageUrl="${ecrEndpoint}/${appName}";

docker login -u AWS -p $(aws ecr get-login-password --region $region) $ecrEndpoint;

docker buildx build --platform linux/amd64,linux/arm64 --progress plain -t "$appName:$commitSha" -t "$appName:$version" -t "$appName:latest" . || exit 1;

docker image tag "$appName:$commitSha" "$ecrImageUrl:$commitSha";
docker image tag "$appName:$version" "$ecrImageUrl:$version";
docker image tag "$appName:latest" "$ecrImageUrl:latest";

docker push $ecrImageUrl --all-tags;