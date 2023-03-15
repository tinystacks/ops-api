const mockGetDashboards = jest.fn();
const mockCreateDashboard = jest.fn();
const mockUpdateDashboard = jest.fn();
const mockDeleteDashboard = jest.fn();

jest.mock('../../src/clients/dashboard-client.ts', () => ({
  getDashboards: mockGetDashboards,
  createDashboard: mockCreateDashboard,
  updateDashboard: mockUpdateDashboard,
  deleteDashboard: mockDeleteDashboard
}));

import { Dashboard } from '@tinystacks/ops-model';
import DashboardController from '../../src/controllers/dashboard-controller';

describe('dashboard controller tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getDashboard', async () => {
    await DashboardController.getDashboards('mock-console');
    expect(mockGetDashboards).toBeCalled();
    expect(mockGetDashboards).toBeCalledWith('mock-console');
  });
  it('postDashboard', async () => {
    const requestBody: Dashboard = {
      id: 'mock-dashboard',
      route: '/mock-dashboard',
      widgetIds: []
    };
    await DashboardController.postDashboard('mock-console', requestBody);
    expect(mockCreateDashboard).toBeCalled();
    expect(mockCreateDashboard).toBeCalledWith('mock-console', requestBody);
  });
  it('putDashboard', async () => {
    const requestBody: Dashboard = {
      id: 'mock-dashboard',
      route: '/mock-dashboard',
      widgetIds: []
    };
    await DashboardController.putDashboard('mock-console', '/mock-dashboard-2', requestBody);
    expect(mockUpdateDashboard).toBeCalled();
    expect(mockUpdateDashboard).toBeCalledWith('mock-console', '/mock-dashboard-2', {
      ...requestBody,
      route: '/mock-dashboard-2'
    });
  });
  it('deleteDashboard', async () => {
    await DashboardController.deleteDashboard('mock-console', '/mock-dashboard');
    expect(mockDeleteDashboard).toBeCalled();
    expect(mockDeleteDashboard).toBeCalledWith('mock-console', '/mock-dashboard');
  });
});