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

docker buildx create --use --name crossx;

docker buildx build \
  --push \
  --platform linux/amd64,linux/arm64 \
  --progress plain \
  -t "$ecrImageUrl:$commitSha" \
  -t "$ecrImageUrl:$version" \
  -t "$ecrImageUrl:latest" . \
  || exit 1;