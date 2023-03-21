const mockMiddleware = jest.fn();
const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockJson = jest.fn();

jest.mock('express');

import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockResponse = {
  status: mockStatus,
  json: mockJson
} as unknown as Response;

import { only, unless } from '../../src/middleware/filters';

describe('filters middleware tests', () => {
  beforeEach(() => {
    mockRequest = { headers: {} } as Request;
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('unless', () => {
    it('does not run middleware if the request path is an exact match', async () => {
      mockRequest.path = '/exact';

      const mw = unless(['/exact'], mockMiddleware);
      await mw(mockRequest, mockResponse, mockNext);

      expect(mockMiddleware).not.toBeCalled();
      expect(mockNext).toBeCalled();
    });
    it('runs middleware if the request path is not an exact match', async () => {
      mockRequest.path = '/exact/not';

      const mw = unless(['/exact'], mockMiddleware);
      await mw(mockRequest, mockResponse, mockNext);

      expect(mockNext).not.toBeCalled();
      expect(mockMiddleware).toBeCalled();
    });
    it('does not run middleware if path has a wildcard and the request path starts with wildcard prefix', async () => {
      mockRequest.path = '/wild/card';

      const mw = unless(['/wild/*'], mockMiddleware);
      await mw(mockRequest, mockResponse, mockNext);

      expect(mockMiddleware).not.toBeCalled();
      expect(mockNext).toBeCalled();
    });
    it('runs middleware if path has a wildcard but the request path does not start with wildcard prefix', async () => {
      mockRequest.path = '/wild-card';

      const mw = unless(['/wild/*'], mockMiddleware);
      await mw(mockRequest, mockResponse, mockNext);

      expect(mockNext).not.toBeCalled();
      expect(mockMiddleware).toBeCalled();
    });
  });
  describe('only', () => {
    it('runs the middleware if the path is an exact match', async () => {
      mockRequest.path = '/exact';

      const mw = only(['/exact'], mockMiddleware);
      await mw(mockRequest, mockResponse, mockNext);

      expect(mockNext).not.toBeCalled();
      expect(mockMiddleware).toBeCalled();
    });
    it('does not run the middleware if the path is not an exact match', async () => {
      mockRequest.path = '/exact/not';

      const mw = only(['/exact'], mockMiddleware);
      await mw(mockRequest, mockResponse, mockNext);

      expect(mockMiddleware).not.toBeCalled();
      expect(mockNext).toBeCalled();
    });
  });
});