FROM public.ecr.aws/docker/library/node:18-slim

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.1 /lambda-adapter /opt/extensions/lambda-adapter

ARG NPM_TOKEN
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG CONFIG_PATH
ENV CONFIG_PATH=${CONFIG_PATH}
ENV PORT=8000

WORKDIR /app

COPY . .

RUN mv ./.npmrc ./.npmrc.dev
RUN mv ./.npmrc.prod ./.npmrc
RUN npm run clean-build
RUN rm -rf ./src
# Uncomment once core-plugins repo exists and is installable
# RUN npm prune --production


EXPOSE 8000
CMD ["node", "./dist/server.js"]