FROM public.ecr.aws/docker/library/node:18-slim

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG CONFIG_PATH
ENV CONFIG_PATH=${CONFIG_PATH}
ENV PORT=8000

WORKDIR /app

COPY . .

RUN npm run clean
RUN npm ci
RUN ls node_modules/.bin
RUN ls node_modules/.bin/tsc
RUN npm run build
# RUN npm run clean-build
# Uncomment once core-plugins repo exists and is installable
# RUN npm prune --production


EXPOSE 8000
CMD ["npm", "start"]