const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockGetDashboards = jest.fn();
const mockPostDashboard = jest.fn();

jest.mock('../../../../src/controllers/dashboard-controller', () => ({
  getDashboards: mockGetDashboards,
  postDashboard: mockPostDashboard
}));

jest.mock('express');

import DashboardRoutes from '../../../../src/routes/consoles/{consoleName}/dashboards';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  route: '/mock'
};
const mockRequestParams = {
  consoleName: 'mock-console'
};
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/dashboards tests', () => {
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
      mockRequest.params = mockRequestParams;
      mockGetDashboards.mockResolvedValue([mockRequestBody]);

      await DashboardRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetDashboards).toBeCalled();
      expect(mockGetDashboards).toBeCalledWith(mockRequestParams.consoleName);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith([mockRequestBody]);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockGetDashboards.mockImplementationOnce(() => { throw mockError; });

      await DashboardRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetDashboards).toBeCalled();
      expect(mockGetDashboards).toBeCalledWith(mockRequestParams.consoleName);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('POST', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      mockPostDashboard.mockResolvedValue(mockRequestBody);

      await DashboardRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostDashboard).toBeCalled();
      expect(mockPostDashboard).toBeCalledWith(mockRequestParams.consoleName, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockPostDashboard.mockImplementationOnce(() => { throw mockError; });

      await DashboardRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostDashboard).toBeCalled();
      expect(mockPostDashboard).toBeCalledWith(mockRequestParams.consoleName, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});