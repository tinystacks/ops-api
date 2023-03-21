const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockPutConsole = jest.fn();
const mockDeleteConsole = jest.fn();

jest.mock('../../../src/controllers/console-controller.js', () => ({
  putConsole: mockPutConsole,
  deleteConsole: mockDeleteConsole
}));

jest.mock('express');

import ConsoleRoutes from '../../../src/routes/consoles/{consoleName}';
import { Request, Response } from 'express';

const mockConsoleName = 'mock-console';
let mockRequest = {
  params: {
    consoleName: mockConsoleName
  }
} as unknown as Request;
const mockRequestBody = {
  name: mockConsoleName
};

const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/consoles tests', () => {
  beforeEach(() => {
    mockRequest = {
      params: {
        consoleName: mockConsoleName
      }
    } as unknown as Request;
    mockStatus.mockReturnValue(mockResponse);
    mockSend.mockReturnValue(mockResponse);
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('PUT', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockPutConsole.mockResolvedValue(mockRequestBody);

      await ConsoleRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutConsole).toBeCalled();
      expect(mockPutConsole).toBeCalledWith(mockConsoleName, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      const mockError = new Error('Error!');
      mockPutConsole.mockImplementationOnce(() => { throw mockError; });

      await ConsoleRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutConsole).toBeCalled();
      expect(mockPutConsole).toBeCalledWith(mockConsoleName, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('DELETE', () => {
    it('returns 200 if successful', async () => {
      mockDeleteConsole.mockResolvedValue([mockRequestBody]);

      await ConsoleRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeleteConsole).toBeCalled();
      expect(mockDeleteConsole).toBeCalledWith(mockConsoleName);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith([mockRequestBody]);
    });
    it('calls next function with error if an error is thrown', async () => {
      const mockError = new Error('Error!');
      mockDeleteConsole.mockImplementationOnce(() => { throw mockError; });

      await ConsoleRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeleteConsole).toBeCalled();
      expect(mockDeleteConsole).toBeCalledWith(mockConsoleName);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});