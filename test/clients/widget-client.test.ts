const mockGetConsole = jest.fn();
const mockSaveConsole = jest.fn();
const mockConsoleClient = jest.fn();

jest.mock('../../src/clients/console-client/index.js', () => mockConsoleClient);

import WidgetClient from '../../src/clients/widget-client.js';
import HttpError from 'http-errors';
import { BasicWidget } from '../utils/basic-widget.js';
import { ConsoleParser } from '@tinystacks/ops-core';
import { Widget, Console, Parameter } from '@tinystacks/ops-model';

const basicConsole = {
  name: 'mock-console',
  widgets: {},
  providers: {},
  dashboards: {},
  dependencies: {}
};

const basicWidget: Widget = {
  id: 'mock-id',
  displayName: 'Mock Widget',
  type: 'BasicWidget'
};
const basicConsoleWithWidget: Console = {
  ...basicConsole,
  widgets: {
    [basicWidget.id]: basicWidget
  },
  dependencies: {
    BasicWidget: require.resolve('../utils/basic-widget.js')
  }
};

describe('widget client tests', () => {
  beforeEach(() => {
    jest.spyOn(WidgetClient, 'getWidget');

    mockConsoleClient.mockReturnValue({
      getConsole: mockGetConsole,
      saveConsole: mockSaveConsole
    });
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();

    // for spies
    jest.restoreAllMocks();
  });
  describe('handleError', () => {
    describe('reuses console client errors when possible', () => {
      it('CONFIG_PATH', () => {
        const error = HttpError.InternalServerError('Cannot fetch console! No value was found for CONFIG_PATH!');
        let thrownError;
        try {
          WidgetClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.InternalServerError('Cannot fetch widget! No value was found for CONFIG_PATH!')
          );
        }
      });
      it('Config file', () => {
        const error = HttpError.NotFound('Cannot fetch console! Config file test.yml not found!');
        let thrownError;
        try {
          WidgetClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.NotFound('Cannot fetch widget! Config file test.yml not found!')
          );
        }
      });
    });
    it('re-throws error', () => {
      const error = new Error('Error!');
      let thrownError;
      try {
        WidgetClient.handleError(error);
      } catch (e) {
        thrownError = e;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(error);
      }
    });
  });
  describe('getWidget', () => {
    it('returns widget from console matching the id specified', async () => {
      const mockWidget = basicWidget;
      const mockConsole = await ConsoleParser.fromJson(basicConsoleWithWidget);
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      const result = await WidgetClient.getWidget({
        consoleName: basicConsoleWithWidget.name,
        widgetId: basicWidget.id
      });

      expect(result).toEqual(mockWidget);
    });
    it('throws not found if widget does not exist on the console', async () => {
      const mockConsole = ConsoleParser.fromJson(basicConsole);
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await WidgetClient.getWidget({
          consoleName: 'mock-console',
          widgetId: basicWidget.id
        });
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Widget with id mock-id does not exist on console mock-console!')
        );
      }
    });
    it('replaces parameter references with parameter values', async () => {
      const mockGetData = jest.fn();
      const mockWidget = {
        id: 'MockWidget',
        displayName: 'Mock $param.param2 $param.param3 $const.const1 Widget',
        type: 'MockWidget',
        otherProp: '$param.param1',
        otherOtherProp: 'static text',
        thirdProp: '$param.param3',
        getData: mockGetData
      };
      const mockConsole = {
        ...basicConsole,
        constants: {
          const1: {
            value: 'const 1',
            type: 'string'
          }
        },
        dashboards: {
          Main: {
            id: 'Main',
            route: '/main',
            parameters: [
              {
                name: 'param1',
                default: 'param 1',
                type: Parameter.type.STRING
              },
              {
                name: 'param2',
                default: 'param 2',
                type: Parameter.type.STRING
              }
            ],
            widgetIds: [
              'MockWidget'
            ]
          }
        },
        widgets: {
          MockWidget: mockWidget
        }
      };
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      const result = await WidgetClient.getWidget({
        consoleName: basicConsole.name,
        widgetId: 'MockWidget',
        parameters: { param1: 'overridden param value' },
        dashboardId: 'Main'
      });

      expect(result).toEqual({
        id: 'MockWidget',
        displayName: 'Mock param 2 $param.param3 const 1 Widget',
        type: 'MockWidget',
        otherProp: 'overridden param value',
        otherOtherProp: 'static text',
        thirdProp: '$param.param3',
        getData: mockGetData
      });
    });
    it('replaces constant references with constant values', async () => {
      const mockGetData = jest.fn();
      const mockWidget = {
        id: 'MockWidget',
        displayName: 'Mock $const.const2 $const.const3 $const.const4 Widget',
        type: 'MockWidget',
        otherProp: '$const.const1',
        otherOtherProp: 'static text',
        thirdProp: '$const.const3',
        fourthProp: '$const.const4',
        getData: mockGetData
      };
      const mockConsole = {
        ...basicConsole,
        constants: {
          const1: {
            value: 'const 1',
            type: 'string'
          },
          const2: {
            value: 'const 2',
            type: 'string'
          },
          const3: {
            value: 'const 3'
          },
        },
        dashboards: {
          Main: {
            id: 'Main',
            route: '/main',
            widgetIds: [
              'MockWidget'
            ],
            parameters: [] as Parameter[]
          }
        },
        widgets: {
          MockWidget: mockWidget
        }
      };
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      const result = await WidgetClient.getWidget({
        consoleName: basicConsole.name,
        widgetId: 'MockWidget'
      });

      expect(result).toEqual({
        id: 'MockWidget',
        displayName: 'Mock const 2 const 3 $const.const4 Widget',
        type: 'MockWidget',
        otherProp: 'const 1',
        otherOtherProp: 'static text',
        thirdProp: 'const 3',
        fourthProp: '$const.const4',
        getData: mockGetData
      });
    });
  });

  describe('getWidgets', () => {
    it('returns widgets from console', async () => {
      const mockWidget = BasicWidget.fromJson(basicWidget);
      const mockConsole = await ConsoleParser.fromJson(basicConsoleWithWidget);
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await WidgetClient.getWidget({
        consoleName: 'mock-console',
        widgetId: basicWidget.id
      });

      expect(result).toEqual(mockWidget);
    });
    it('throws if an error occurs', async () => {
      const mockError = new Error('Error!');
      mockGetConsole.mockImplementationOnce(()=> { throw mockError; });

      let thrownError;
      try {
        await WidgetClient.getWidget({
          consoleName: 'mock-console',
          widgetId: basicWidget.id
        });
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
  describe('createWidget', () => {
    it('saves widget to console and returns saved widget', async () => {
      const mockWidget = BasicWidget.fromJson(basicWidget);
      const mockConsole = await ConsoleParser.fromJson({
        ...basicConsole,
        dependencies: { ...basicConsoleWithWidget.dependencies }
      });
      const mockSavedConsole = await ConsoleParser.fromJson(basicConsoleWithWidget);
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      mockGetConsole.mockResolvedValueOnce(mockSavedConsole);
      const result = await WidgetClient.createWidget('mock-console', mockWidget);

      expect(mockGetConsole).toBeCalledTimes(2);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledWith('mock-console', mockSavedConsole);
      expect(WidgetClient.getWidget).toBeCalledTimes(1);
      expect(result).toEqual({
        ...mockWidget,
        id: mockWidget.id
      });
    });

    it('throws Conflict if widget already exists on console', async () => {
      const mockWidget = BasicWidget.fromJson(basicWidget);
      const mockConsole = ConsoleParser.fromJson(basicConsoleWithWidget);
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      let thrownError;
      try {
        await WidgetClient.createWidget('mock-console', mockWidget);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(WidgetClient.getWidget).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.Conflict('Cannot create new widget with id mock-id because a widget with this id already exists on console mock-console!')
        );
      }
    });
  });
  describe('updateWidget', () => {
    it('saves widget to console and returns saved widget', async () => {
      const oldMockWidget = BasicWidget.fromJson(basicWidget);
      const oldMockConsole = await ConsoleParser.fromJson({
        ...basicConsoleWithWidget,
        widgets: {
          [oldMockWidget.id]: oldMockWidget
        }
      });
      const newMockWidget = BasicWidget.fromJson({
        ...basicWidget,
        displayName: 'Mock Widget 2'
      });
      const newMockConsole = await ConsoleParser.fromJson({
        ...basicConsoleWithWidget,
        widgets: {
          [newMockWidget.id]: newMockWidget
        }
      });
      mockGetConsole.mockResolvedValueOnce(oldMockConsole);
      mockGetConsole.mockResolvedValueOnce(newMockConsole);
      const result = await WidgetClient.updateWidget('mock-console', basicWidget.id, newMockWidget);

      expect(mockGetConsole).toBeCalledTimes(2);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(WidgetClient.getWidget).toBeCalledTimes(1);
      expect(result).toEqual(newMockWidget);
    });
    it('throws NotFound if widget does not exist on console', async () => {
      const mockWidget = BasicWidget.fromJson(basicWidget);
      const mockConsole = await ConsoleParser.fromJson(basicConsole);
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      let thrownError;
      try {
        await WidgetClient.updateWidget('mock-console', basicWidget.id, mockWidget);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(WidgetClient.getWidget).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Cannot update widget with id mock-id because this widget does not exist on console mock-console!')
        );
      }
    });
  });
  describe('deleteWidget', () => {
    it('deletes widget from console and returns deleted widget', async () => {
      const mockWidget = BasicWidget.fromJson(basicWidget);
      const mockConsole = await ConsoleParser.fromJson(basicConsoleWithWidget);
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await WidgetClient.deleteWidget('mock-console', basicWidget.id);

      expect(mockGetConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(result).toEqual(mockWidget);
    });
    it('throws NotFound if widget does not exist on console', async () => {
      const mockConsole = await ConsoleParser.fromJson(basicConsole);
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await WidgetClient.deleteWidget('mock-console', 'mock-id');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(WidgetClient.getWidget).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Cannot delete widget with id mock-id because this widget does not exist on console mock-console!')
        );
      }
    });
  });
});