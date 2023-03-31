# ops-backend
REST API for ops console

To install dependencies:

```bash
npm ci
```

To run on your local machine:

```bash
npm run local
```

OR

```bash
npm run build;
CONFIG_PATH="./path/to/config.yml" NODE_ENV=dev node ./dist/server.js
```

To run in docker:
```bash
npm run dev
```

Install peer dependencies:
```
brew install yq
brew install jq
```