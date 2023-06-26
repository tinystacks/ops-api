const mockGetDashboards = jest.fn();
const mockCreateDashboard = jest.fn();
const mockUpdateDashboard = jest.fn();
const mockDeleteDashboard = jest.fn();

jest.mock('../../src/clients/dashboard-client.js', () => ({
  getDashboards: mockGetDashboards,
  createDashboard: mockCreateDashboard,
  updateDashboard: mockUpdateDashboard,
  deleteDashboard: mockDeleteDashboard
}));

import { Dashboard } from '@tinystacks/ops-model';
import DashboardController from '../../src/controllers/dashboard-controller.js';

describe('dashboard controller tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getDashboard', async () => {
    mockGetDashboards.mockResolvedValueOnce([]);
    await DashboardController.getDashboards('mock-console');
    expect(mockGetDashboards).toBeCalled();
    expect(mockGetDashboards).toBeCalledWith('mock-console');
  });
  it('postDashboard', async () => {
    mockCreateDashboard.mockResolvedValueOnce({ toJson: () => '' });
    const requestBody: Dashboard = {
      id: 'mock-dashboard',
      route: '/mock-dashboard',
      widgetIds: [],
      parameters: []
    };
    await DashboardController.postDashboard('mock-console', requestBody);
    expect(mockCreateDashboard).toBeCalled();
    expect(mockCreateDashboard).toBeCalledWith('mock-console', requestBody);
  });
  it('putDashboard', async () => {
    mockUpdateDashboard.mockResolvedValueOnce({ toJson: () => '' });
    const requestBody: Dashboard = {
      id: 'mock-dashboard',
      route: '/mock-dashboard',
      widgetIds: [],
      parameters: []
    };
    await DashboardController.putDashboard('mock-console', 'mock-dashboard', requestBody);
    expect(mockUpdateDashboard).toBeCalled();
    expect(mockUpdateDashboard).toBeCalledWith(
      'mock-console',
      'mock-dashboard',
      requestBody
    );
  });
  it('deleteDashboard', async () => {
    mockDeleteDashboard.mockResolvedValueOnce({ toJson: () => '' });
    await DashboardController.deleteDashboard('mock-console', '/mock-dashboard');
    expect(mockDeleteDashboard).toBeCalled();
    expect(mockDeleteDashboard).toBeCalledWith('mock-console', '/mock-dashboard');
  });
});