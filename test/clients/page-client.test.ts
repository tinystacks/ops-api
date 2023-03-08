const mockGetConsole = jest.fn();
const mockSaveConsole = jest.fn();

jest.mock('../../src/clients/console-client', () => ({
  getConsole: mockGetConsole,
  saveConsole: mockSaveConsole
}));

import Console from '../../src/classes/console';
import Dashboard from '../../src/classes/dashboard';
import DashboardClient from '../../src/clients/dashboard-client';
import HttpError from 'http-errors';

describe('dashboard client tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('handleError', () => {
    describe('reuses console client errors when possible', () => {
      it('CONFIG_PATH', () => {
        const error = HttpError.InternalServerError('Cannot fetch consoles! No value was found for CONFIG_PATH!');
        let thrownError;
        try {
          DashboardClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.InternalServerError('Cannot fetch dashboards! No value was found for CONFIG_PATH!')
          );
        }
      });
      it('Config file', () => {
        const error = HttpError.NotFound('Cannot fetch consoles! Config file test.yml not found!');
        let thrownError;
        try {
          DashboardClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.NotFound('Cannot fetch dashboards! Config file test.yml not found!')
          );
        }
      });
    });
    it('re-throws error', () => {
      const error = new Error('Error!');
      let thrownError;
      try {
        DashboardClient.handleError(error);
      } catch (e) {
        thrownError = e;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(error);
      }
    });
  });
  describe('getDashboard', () => {
    it('returns dashboard from console matching the route specified', async () => {
      const mockDashboard = Dashboard.fromJson({
        id: 'MockRoute',
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: mockDashboard
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await DashboardClient.getDashboard('mock-console', 'MockRoute');

      expect(result).toEqual(mockDashboard);
    });
    it('throws not found if dashboard does not exist on the console', async () => {
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {},
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await DashboardClient.getDashboard('mock-console', 'MockRoute');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Dashboard with id MockRoute does not exist in console mock-console!')
        );
      }
    });
  });

  describe('getDashboards', () => {
    it('returns dashboards from console', async () => {
      const mockDashboard = Dashboard.fromJson({
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: mockDashboard
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await DashboardClient.getDashboards('mock-console');

      expect(result).toEqual([mockDashboard]);
    });
    it('throws if an error occurs', async () => {
      const mockError = new Error('Error!');
      mockGetConsole.mockImplementationOnce(()=> { throw mockError; });

      let thrownError;
      try {
        await DashboardClient.getDashboards('mock-console');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
  describe('createDashboard', () => {
    it('saves dashboard to console and returns saved dashboard', async () => {
      const mockDashboard = Dashboard.fromJson({
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {},
        providers: {},
        widgets: {}
      });
      const mockSavedConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: { 
            ...mockDashboard,
            id: 'MockRoute'
          }
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      mockGetConsole.mockResolvedValueOnce(mockSavedConsole);
      jest.spyOn(DashboardClient, 'getDashboard');

      const result = await DashboardClient.createDashboard('mock-console', mockDashboard);

      expect(mockGetConsole).toBeCalledTimes(2);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledWith('mock-console', mockSavedConsole);
      expect(DashboardClient.getDashboard).toBeCalledTimes(1);
      expect(result).toEqual({
        ...mockDashboard,
        id: 'MockRoute'
      });
    });
    it('throws Conflict if dashboard with id already exists on console', async () => {
      const mockDashboard = Dashboard.fromJson({
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: mockDashboard
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(DashboardClient, 'getDashboard');

      let thrownError;
      try {
        await DashboardClient.createDashboard('mock-console', mockDashboard);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(DashboardClient.getDashboard).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.Conflict('Cannot create new dashboard with id MockRoute because a dashboard with this id already exists on console mock-console!')
        );
      }
    });
    it('throws Conflict if dashboard with route already exists on console', async () => {
      const mockDashboard = Dashboard.fromJson({
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MainDashboard: mockDashboard
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(DashboardClient, 'getDashboard');

      let thrownError;
      try {
        await DashboardClient.createDashboard('mock-console', mockDashboard);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(DashboardClient.getDashboard).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.Conflict('Cannot create new dashboard with route /mock-route because a dashboard with this route already exists on console mock-console!')
        );
      }
    });
  });
  describe('updateDashboard', () => {
    it('saves dashboard to console and returns saved dashboard', async () => {
      const oldMockDashboard = Dashboard.fromJson({
        id: 'MockRoute',
        route: '/mock-route',
        widgetIds: []
      });
      const oldMockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: oldMockDashboard
        },
        providers: {},
        widgets: {}
      });
      const newMockDashboard = Dashboard.fromJson({
        id: 'MockRoute',
        route: '/mock-route',
        widgetIds: ['widget-1']
      }); 
      const newMockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: newMockDashboard
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(oldMockConsole);
      mockGetConsole.mockResolvedValueOnce(newMockConsole);
      jest.spyOn(DashboardClient, 'getDashboard');

      const result = await DashboardClient.updateDashboard('mock-console', 'MockRoute', newMockDashboard);

      expect(mockGetConsole).toBeCalledTimes(2);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(DashboardClient.getDashboard).toBeCalledTimes(1);
      expect(result).toEqual(newMockDashboard);
    });
    it('throws NotFound if dashboard does not exist on console', async () => {
      const mockDashboard = Dashboard.fromJson({
        id: 'MockRoute',
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {},
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(DashboardClient, 'getDashboard');

      let thrownError;
      try {
        await DashboardClient.updateDashboard('mock-console', 'MockRoute', mockDashboard);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(DashboardClient.getDashboard).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Cannot update dashboard with id MockRoute because this dashboard does not exist on console mock-console!')
        );
      }
    });
  });
  describe('deleteDashboard', () => {
    it('deletes dashboard from console and returns deleted dashboard', async () => {
      const mockDashboard = Dashboard.fromJson({
        id: 'MockRoute',
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {
          MockRoute: mockDashboard
        },
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await DashboardClient.deleteDashboard('mock-console', 'MockRoute');

      expect(mockGetConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(result).toEqual(mockDashboard);
    });
    it('throws NotFound if dashboard does not exist on console', async () => {
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        dashboards: {},
        providers: {},
        widgets: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(DashboardClient, 'getDashboard');

      let thrownError;
      try {
        await DashboardClient.deleteDashboard('mock-console', 'MockRoute');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(DashboardClient.getDashboard).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Cannot delete dashboard with id MockRoute because this dashboard does not exist on console mock-console!')
        );
      }
    });
  });
});