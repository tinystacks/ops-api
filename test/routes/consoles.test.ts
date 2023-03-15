const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockGetConsoles = jest.fn();
const mockPostConsole = jest.fn();
const mockPutConsole = jest.fn();
const mockDeleteConsole = jest.fn();

jest.mock('../../src/controllers/console-controller.ts', () => ({
  getConsoles: mockGetConsoles,
  postConsole: mockPostConsole,
  putConsole: mockPutConsole,
  deleteConsole: mockDeleteConsole
}));

jest.mock('express');

import ConsoleRoutes from '../../src/routes/consoles';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  name: 'mock-console'
};

const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/consoles tests', () => {
  beforeEach(() => {
    mockRequest = {} as Request;
    mockStatus.mockReturnValue(mockResponse);
    mockSend.mockReturnValue(mockResponse);
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('GET', () => {
    it('returns 200 if successful', async () => {
      mockGetConsoles.mockResolvedValue([mockRequestBody]);

      await ConsoleRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetConsoles).toBeCalled();
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith([mockRequestBody]);
    });
    it('calls next function with error if an error is thrown', async () => {
      const mockError = new Error('Error!');
      mockGetConsoles.mockImplementationOnce(() => { throw mockError; });

      await ConsoleRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetConsoles).toBeCalled();
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('POST', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockPostConsole.mockResolvedValue(mockRequestBody);

      await ConsoleRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostConsole).toBeCalled();
      expect(mockPostConsole).toBeCalledWith(mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      const mockError = new Error('Error!');
      mockPostConsole.mockImplementationOnce(() => { throw mockError; });

      await ConsoleRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostConsole).toBeCalled();
      expect(mockPostConsole).toBeCalledWith(mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});