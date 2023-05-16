FROM public.ecr.aws/docker/library/node:18-slim

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.1 /lambda-adapter /opt/extensions/lambda-adapter

ARG NPM_TOKEN
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG CONFIG_PATH
ENV CONFIG_PATH=${CONFIG_PATH}
ENV PORT=8000
ARG ARCH
ENV ARCH=${ARCH}
ARG DEPENDENCIES
ENV DEPENDENCIES=${DEPENDENCIES}

WORKDIR /config

COPY ./basicexample.yml .

WORKDIR /app

COPY . .

# Install CLI dependencies
RUN chmod +x ./install-cli-tools.sh
RUN bash ./install-cli-tools.sh

# BUILD
RUN if [ ! -z "${DEPENDENCIES}" ]; then npm i $DEPENDENCIES;  fi;
RUN npm run clean-build
RUN rm -rf ./src
RUN rm -rf ./install-cli-tools.sh
RUN npm prune --production


EXPOSE 8000
CMD ["node", "--experimental-import-meta-resolve", "./dist/server.js"]