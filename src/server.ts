import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import { initialize } from 'express-openapi';
import yaml from 'yamljs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { resolveRefsAt } from 'json-refs';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { errorMiddleware } from './middleware';
import { authenticationMiddleware } from './middleware/auth-n';

function shutdown (server: any) {
  server.close((error: Error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
}

async function startServer () {
  if (process.env.NODE_ENV === 'dev') {
    console.debug('Running in dev mode; sourcing with dotenv.');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
  }

  const CONFIG_PATH = process.env.CONFIG_PATH;

  if (!CONFIG_PATH) {
    console.warn('No config path specified! API results may be empty.');
  }
  
  const PORT = process.env.PORT || 8000;
  
  console.debug('Setting up express and middleware.');
  const app: Application = express();
  app.use(json());
  app.use(authenticationMiddleware);
  app.use(cors());
  
  console.debug('Constructing the swagger docs and open api spec.');
  const rootDocLocation = require.resolve('@tinystacks/ops-model/src/index.yml');
  console.debug('rootDocLocation: ', rootDocLocation);
  const apiDoc = yaml.parse(readFileSync(rootDocLocation, 'utf-8'));

  const swaggerSpec = await resolveRefsAt(rootDocLocation,  {
    loaderOptions : {
      processContent: (res: any, callback: any) => {
        callback(null, yaml.parse(res.text));
      }
    }
  });
  
  console.debug('Initializing express-openapi');
  await initialize({
    app,
    apiDoc,
    paths: resolve(__dirname, './routes'),
    promiseMode: true,
    errorMiddleware
  });
  
  console.debug('Setting /docs route.');
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec.resolved)
  );
  
  console.debug('Setting / route.');
  app.get('/', (_request: Request, response: Response) => {
    const responseBody = 'Hello world from ops-console-api!';
    response.status(200).send(responseBody);
  });
  
  console.debug('Setting error middleware.');
  app.use(errorMiddleware);
  
  console.debug('Listenting to port.');
  const server = app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
  
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Exiting gracefully...');
    shutdown(server);
  });
  process.on('SIGTERM', () => {
    console.log('\n');
    console.log('Received SIGTERM. Exiting gracefully...');
    shutdown(server);
  });
}
console.debug('Starting server...');
void startServer();