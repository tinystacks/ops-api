const mockGetConsole = jest.fn();
const mockSaveConsole = jest.fn();

jest.mock('../../src/clients/console-client/index.js', () => jest.fn().mockImplementation(() =>({
  getConsole: mockGetConsole,
  saveConsole: mockSaveConsole
})));


import DashboardClient from '../../src/clients/dashboard-client';
import HttpError from 'http-errors';
import { Console, Dashboard } from '@tinystacks/ops-core';
import { Console as ConsoleType, Dashboard as DashboardType } from '@tinystacks/ops-model';

const mockSpyGetDashboard = jest.spyOn(DashboardClient, 'getDashboard');

const basicDashboardJson: DashboardType = {
  id: 'MockRoute',
  route: '/mock-route',
  widgetIds: []
};

const basicConsoleJson: ConsoleType = {
  name: 'mock-console',
  dashboards: {},
  providers: {},
  widgets: {},
  dependencies: {}
};

describe('dashboard client tests', () => {
  afterEach(() => {
    // for mocks
    mockGetConsole.mockReset();
    mockSaveConsole.mockReset();
    // for spies
    mockSpyGetDashboard.mockRestore();
    // jest.restoreAllMocks();
  });
  describe('handleError', () => {
    describe('reuses console client errors when possible', () => {
      it('CONFIG_PATH', () => {
        const error = HttpError.InternalServerError('Cannot fetch console! No value was found for CONFIG_PATH!');
        let thrownError;
        try {
          DashboardClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.InternalServerError('Cannot fetch dashboard! No value was found for CONFIG_PATH!')
          );
        }
      });
      it('Config file', () => {
        const error = HttpError.NotFound('Cannot fetch console! Config file test.yml not found!');
        let thrownError;
        try {
          DashboardClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.NotFound('Cannot fetch dashboard! Config file test.yml not found!')
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
      const mockDashboard = Dashboard.fromJson(basicDashboardJson);
      const mockConsole = Console.fromJson({
        ...basicConsoleJson,
        dashboards: { MockRoute: mockDashboard }
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await DashboardClient.getDashboard('mock-console', 'MockRoute');

      expect(result).toEqual(mockDashboard);
    });
    it('throws not found if dashboard does not exist on the console', async () => {
      const mockConsole = Console.fromJson(basicConsoleJson);
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await DashboardClient.getDashboard('mock-console', 'MockRoute');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('DashboardType with id MockRoute does not exist in console mock-console!')
        );
      }
    });
  });

  describe('getDashboards', () => {
    it('returns dashboards from console', async () => {
      const mockDashboard = Dashboard.fromJson(basicDashboardJson);
      const mockConsole = await Console.fromJson({
        ...basicConsoleJson,
        dashboards: { MockRoute: mockDashboard }
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
        id: 'mock-dashboard',
        route: '/mock-route',
        widgetIds: []
      } as DashboardType);
      const mockConsole = await Console.fromJson(basicConsoleJson);
      const mockSavedConsole = await Console.fromJson({
        ...basicConsoleJson,
        dashboards: {
          'mock-dashboard': {
            ...mockDashboard,
            id: 'mock-dashboard'
          }
        }
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
        ...mockDashboard
      });

      mockGetConsole.mockReset();
      mockSaveConsole.mockReset();
    });
    it('throws Conflict if dashboard with id already exists on console', async () => {
      const mockDashboard = Dashboard.fromJson({
        id: 'mock-dashboard',
        route: '/mock-route',
        widgetIds: []
      } as DashboardType);
      const mockConsole = Console.fromJson({
        ...basicConsoleJson,
        dashboards: {
          'mock-dashboard': mockDashboard
        }
      } as ConsoleType);
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await DashboardClient.createDashboard('mock-console', mockDashboard);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(mockSpyGetDashboard).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.Conflict('Cannot create new dashboard with id mock-dashboard because a dashboard with this id already exists on console mock-console!')
        );
      }
    });
    it('throws Conflict if dashboard with route already exists on console', async () => {
      const mockDashboard = Dashboard.fromJson({
        id: 'mock-dashboard',
        route: '/mock-route',
        widgetIds: []
      });
      const mockConsole = Console.fromJson({
        ...basicConsoleJson,
        dashboards: {
          MainDashboard: mockDashboard
        }
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await DashboardClient.createDashboard('mock-console', mockDashboard);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(mockSpyGetDashboard).not.toBeCalled();

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
        ...basicConsoleJson,
        dashboards: {
          MockRoute: oldMockDashboard
        }
      });
      const newMockDashboard = Dashboard.fromJson({
        id: 'MockRoute',
        route: '/mock-route',
        widgetIds: []
      });
      const newMockConsole = Console.fromJson({
        ...basicConsoleJson,
        dashboards: {
          MockRoute: newMockDashboard
        }
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
        ...basicConsoleJson
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
        ...basicConsoleJson,
        dashboards: {
          MockRoute: mockDashboard
        }
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await DashboardClient.deleteDashboard('mock-console', 'MockRoute');

      expect(mockGetConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(result).toEqual(mockDashboard);
    });
    it('throws NotFound if dashboard does not exist on console', async () => {
      const mockConsole = Console.fromJson(basicConsoleJson);
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