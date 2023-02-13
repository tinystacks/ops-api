#!/bin/bash

callerIdentity=$(aws sts get-caller-identity);
accountId=$(jq -r .Account <<< $callerIdentity);
version=$(cat ./package.json | jq -r .version);
appName=$(cat ./package.json | jq -r .name);
commitSha=$(git rev-parse HEAD);
region="${AWS_REGION:-us-east-1}";
ecrEndpoint="${accountId}.dkr.ecr.${region}.amazonaws.com";
ecrImageUrl="${ecrEndpoint}/${appName}";

npm config set @tinystacks:registry https://npm.pkg.github.com/
npm config set //npm.pkg.github.com/:_authToken $NPM_TOKEN
mv ./.npmrc ./.npmrc.dev
mv ./.npmrc.prod ./.npmrc

docker login -u AWS -p $(aws ecr get-login-password --region $region) $ecrEndpoint;

docker build \
  --progress plain \
  -t "$appName:$commitSha-${ARCH}" \
  -t "$appName:$version-${ARCH}" \
  -t "$appName:latest-${ARCH}" . \
  || exit 1;

docker image tag "$appName:$commitSha-${ARCH}" "$ecrImageUrl:$commitSha-${ARCH}";
docker image tag "$appName:$version-${ARCH}" "$ecrImageUrl:$version-${ARCH}";
docker image tag "$appName:latest-${ARCH}" "$ecrImageUrl:latest-${ARCH}";

docker push $ecrImageUrl --all-tags;

aws codebuild start-build \
  --project-name "$RELEASE_PROJECT" \
  --environment-variables-override name="IMAGE_TAG",value="$commitSha",type="PLAINTEXT" name="VERSION",value="$version",type="PLAINTEXT";
