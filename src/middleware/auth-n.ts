import HttpError from 'http-errors';
import cached from 'cached';
import {
  Request,
  Response,
  NextFunction
} from 'express';
import { APIGateway, APIGatewayClientConfig } from '@aws-sdk/client-api-gateway';
import { fromIni } from '@aws-sdk/credential-providers';

const fiveMinutes = 5 * 60;
const cache = cached('apiKey', {
  backend: {
    type: 'memory'
  },
  defaults: {
    expire: fiveMinutes
  }
});

async function fetchApiKey () {
  try {
    const config: APIGatewayClientConfig = {};
    const regionOverride = process.env.AWS_REGION_OVERRIDE;
    if (regionOverride) {
      config.region = regionOverride;
    }
    const profile = process.env.AWS_PROFILE_OVERRIDE;
    if (profile) {
      config.credentials = fromIni({ profile });
    }
    const apigClient = new APIGateway(config);
    const response = await apigClient.getApiKey({
      apiKey: process.env.API_KEY_ID,
      includeValue: true
    });
    return response.value;
  } catch (error) {
    console.error('Failed to fetch api key!', error);
    return '';
  }
}

async function validateApiKey (request: Request) {
  const authHeader = request.headers['Authorization'] || request.headers['authorization'];
  // console.debug('Headers: ', Object.keys(request.headers));
  if (!authHeader) {
    console.error('No Authorization header included in the request!');
    throw HttpError.Unauthorized();
  }

  const apiKeyId = process.env.API_KEY_ID;
  if (!apiKeyId) {
    console.warn('No API_KEY_ID is set! All requests will fail with 401s!');
    throw HttpError.Unauthorized();
  }
  
  const apiKeySecret = await cache.getOrElse(apiKeyId, fetchApiKey);

  if (apiKeySecret !== authHeader) {
    console.error('Invalid Authorization header included in the request!');
    throw HttpError.Unauthorized();
  }
}

export async function authenticationMiddleware (request: Request, response: Response, next: NextFunction) {
  try {
    if (request.method !== 'OPTIONS' && process.env.NODE_ENV === 'production') {
      await validateApiKey(request);
      console.log(`Request ${request.method} ${request.url}`);
    }
    next();
  } catch (e) {
    response.status(401).send(HttpError.Unauthorized('Authentication is required!'));
    return;
  }
}