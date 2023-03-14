const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockPutDashboard = jest.fn();
const mockDeleteDashboard = jest.fn();

jest.mock('../../../../../src/controllers/dashboard-controller.ts', () => ({
  putDashboard: mockPutDashboard,
  deleteDashboard: mockDeleteDashboard
}));

jest.mock('express');

import DashboardRoutes from '../../../../../src/routes/consoles/{consoleName}/dashboards/{dashboardId}';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  name: 'mock-dashboard'
};
const mockRequestParams = {
  consoleName: 'mock-console',
  dashboardId: 'mock'
};
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/dashboards/{dashboardId} tests', () => {
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
  describe('PUT', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      mockPutDashboard.mockResolvedValue(mockRequestBody);

      await DashboardRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutDashboard).toBeCalled();
      expect(mockPutDashboard).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.dashboardId, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockPutDashboard.mockImplementationOnce(() => { throw mockError; });

      await DashboardRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutDashboard).toBeCalled();
      expect(mockPutDashboard).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.dashboardId, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('DELETE', () => {
    it('returns 200 if successful', async () => {
      mockRequest.params = mockRequestParams;
      mockDeleteDashboard.mockResolvedValue(mockRequestBody);

      await DashboardRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeleteDashboard).toBeCalled();
      expect(mockDeleteDashboard).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.dashboardId);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockDeleteDashboard.mockImplementationOnce(() => { throw mockError; });

      await DashboardRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeleteDashboard).toBeCalled();
      expect(mockDeleteDashboard).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.dashboardId);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});