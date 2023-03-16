FROM public.ecr.aws/docker/library/node:18-slim

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.1 /lambda-adapter /opt/extensions/lambda-adapter

ARG NPM_TOKEN
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG CONFIG_PATH
ENV CONFIG_PATH=${CONFIG_PATH}
ENV PORT=8000
ARG ARCH=x86
ENV ARCH=${ARCH}

WORKDIR /config

COPY ./basicexample.yml .

WORKDIR /app

COPY . .

RUN echo Y | apt-get update
RUN echo Y | apt-get install apt-utils
RUN echo Y | apt-get install jq
RUN echo Y | apt-get install curl
RUN echo Y | apt-get install alien
RUN echo Y | apt-get install unzip

# AWS CLI
RUN echo Y | apt-get install awscli
RUN aws --version
# SSM
RUN if [ $ARCH = "x86" ]; then curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install; fi
RUN echo Y | apt-get install dpkg
RUN if [ $ARCH = "x86" ]; then curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb" && dpkg -i session-manager-plugin.deb; fi

# BUILD
RUN npm run clean-build
RUN rm -rf ./src
RUN npm prune --production


EXPOSE 8000
CMD ["node", "./dist/server.js"]