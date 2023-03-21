const mockApiGateway = jest.fn();
const mockGetApiKey = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockNext = jest.fn();
const mockFromIni = jest.fn();

import {
  Request,
  Response
} from 'express';
import HttpError from 'http-errors';
import { MockCache } from "../mocks/MockCache";

const mockApiKeyId = 'mock-api-key-id';
const mockApiKeySecret = 'mock-api-key-secret';
const mockResponse = {
  status: (...args) => {
    mockStatus(...args);
    return mockResponse;
  },
  send: (...args) => {
    mockSend(...args);
    return mockResponse;
  }
} as Response;
let mockRequest = { headers: {} } as Request;

const mockCache = new MockCache();

jest.mock('cached', () => (() => mockCache));

jest.mock('@aws-sdk/client-api-gateway', () => ({
  APIGateway: mockApiGateway
}));
jest.mock('@aws-sdk/credential-providers', () => ({
  fromIni: mockFromIni
}));

import { authenticationMiddleware } from '../../src/middleware/auth-n';

describe('auth-n middleware tests', () => {
  beforeEach(() => {
    delete process.env.AWS_REGION_OVERRIDE;
    delete process.env.AWS_PROFILE_OVERRIDE;
    delete process.env.API_KEY_ID;
    delete process.env.NODE_ENV;
    jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
    jest.spyOn(global.console, 'warn').mockImplementation(jest.fn());
    jest.spyOn(global.console, 'log').mockImplementation(jest.fn());

    mockApiGateway.mockReturnValue({
      getApiKey: mockGetApiKey
    });

    mockRequest = { headers: {} } as Request;
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
    mockCache.reset();
  });
  describe('authenticationMiddleware', () => {
    it('does nothing if request method is OPTIONS', async () => {
      process.env.NODE_ENV = 'production';
      mockRequest.method = 'OPTIONS';

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockCache.getOrElse).not.toBeCalled();
      expect(mockGetApiKey).not.toBeCalled();

      expect(mockNext).toBeCalled();
    });
    it('does nothing if NODE_ENV is not production', async () => {
      process.env.NODE_ENV = 'dev';
      mockRequest.method = 'GET';

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockCache.getOrElse).not.toBeCalled();
      expect(mockGetApiKey).not.toBeCalled();

      expect(mockNext).toBeCalled();
    });
    it('throws unauthorized if there is no auth header', async () => {
      process.env.NODE_ENV = 'production';
      mockRequest.method = 'GET';

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockCache.getOrElse).not.toBeCalled();
      expect(mockGetApiKey).not.toBeCalled();

      expect(mockNext).not.toBeCalled();

      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledTimes(2);
      expect(console.error).toBeCalledWith('No Authorization header included in the request!');
      expect(console.error).toBeCalledWith('Received and error in authentication middleware!', HttpError.Unauthorized());

      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(401);
      
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(HttpError.Unauthorized('Authentication is required!'));
    });
    it('throws unauthorized if there is no API_KEY_ID environment variable set', async () => {
      process.env.NODE_ENV = 'production';
      mockRequest.method = 'GET';
      mockRequest.headers = {
        authorization: 'Bearer mock-token'
      };

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockCache.getOrElse).not.toBeCalled();
      expect(mockGetApiKey).not.toBeCalled();

      expect(mockNext).not.toBeCalled();
      
      expect(console.warn).toBeCalled();
      expect(console.warn).toBeCalledTimes(1);
      expect(console.warn).toBeCalledWith('No API_KEY_ID is set! All requests will fail with 401s!');

      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledTimes(1);
      expect(console.error).toBeCalledWith('Received and error in authentication middleware!', HttpError.Unauthorized());

      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(401);
      
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(HttpError.Unauthorized('Authentication is required!'));
    });
    it('uses cached key if it exists, throws 401 if auth header doesn\'t match api key secret', async () => {
      process.env.NODE_ENV = 'production';
      process.env.API_KEY_ID = mockApiKeyId;
      mockRequest.method = 'GET';
      mockRequest.headers = {
        authorization: 'Bearer mock-token'
      };
      mockCache.getOrElse.mockResolvedValue(mockApiKeySecret);

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockGetApiKey).not.toBeCalled();
      expect(mockNext).not.toBeCalled();

      expect(mockCache.getOrElse).toBeCalled();
      expect(mockCache.getOrElse).toBeCalledWith(mockApiKeyId, expect.any(Function));

      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledTimes(2);
      expect(console.error).toBeCalledWith('Invalid Authorization header included in the request!');
      expect(console.error).toBeCalledWith('Received and error in authentication middleware!', HttpError.Unauthorized());

      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(401);
      
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(HttpError.Unauthorized('Authentication is required!'));
    });
    it('fetched api key secret if it is not cached, calls next if auth header matches api key secret', async () => {
      process.env.NODE_ENV = 'production';
      process.env.API_KEY_ID = mockApiKeyId;
      process.env.AWS_REGION_OVERRIDE = 'us-west-2';
      process.env.AWS_PROFILE_OVERRIDE = 'ts';
      mockRequest.method = 'GET';
      mockRequest.headers = {
        Authorization: mockApiKeySecret
      };
      mockGetApiKey.mockResolvedValueOnce({
        value: mockApiKeySecret
      });
      mockCache.getOrElse.mockImplementation((key: string, refreshFunction: (...args: any[]) => Promise<any>) => {
        return refreshFunction();
      });

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);

      expect(console.error).not.toBeCalled();
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      
      expect(mockCache.getOrElse).toBeCalled();
      expect(mockCache.getOrElse).toBeCalledWith(mockApiKeyId, expect.any(Function));
      
      expect(mockFromIni).toBeCalled();
      expect(mockFromIni).toBeCalledWith({ profile: 'ts' });

      expect(mockGetApiKey).toBeCalled();
      expect(mockGetApiKey).toBeCalledWith({
        apiKey: mockApiKeyId,
        includeValue: true
      });
      
      expect(mockNext).toBeCalled();
    });
  });
});