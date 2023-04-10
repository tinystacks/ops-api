import { DashboardParser } from '@tinystacks/ops-core';
import {
  castParametersToDeclaredTypes,
  castToType,
  parseObjectTypeQueryParam
} from '../../src/utils/parsing-utils.js';
import cloneDeep from 'lodash.clonedeep';
import { Parameter } from '@tinystacks/ops-model';

describe('parsing-utils', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('parseObjectTypeQueryParam', () => {
    it('returns parsed value for stringified object query params', () => {
      const mockParam = {
        prop1: 1,
        prop2: '2'
      };
      const paramName = 'mockParam';
      const queryParams = {
        mockParam: JSON.stringify(mockParam)
      };

      const result = parseObjectTypeQueryParam(paramName, queryParams);

      expect(result).toEqual(mockParam);
    });
    it('logs error and returns undefined for invalid stringified json', () => {
      jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
      const mockParam = 'invalid';
      const paramName = 'mockParam';
      const queryParams = {
        mockParam
      };

      const result = parseObjectTypeQueryParam(paramName, queryParams);

      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledTimes(2);
      expect(console.error).toBeCalledWith('Non-parseable query param mockParam!');
      expect(console.error).toBeCalledWith(new SyntaxError('Unexpected token i in JSON at position 0'));
      expect(result).toBeUndefined();
    });
    it('returns parsed value for object query params that are serializable as JSON', () => {
      const mockParam = {
        prop1: 1,
        prop2: '2'
      };
      const paramName = 'mockParam';
      const queryParams = {
        mockParam
      };

      const result = parseObjectTypeQueryParam(paramName, queryParams);

      expect(result).toEqual(mockParam);
    });
    it('logs error and returns undefined for non-serializeable json', () => {
      jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
      class MockParam {
        prop1: 1;
        prop2: MockParam;
        constructor () {
          this.prop1 = 1;
          this.prop2 = this;
        }
      }
      const mockParam = new MockParam();
      const paramName = 'mockParam';
      const queryParams = {
        mockParam
      };

      const result = parseObjectTypeQueryParam(paramName, queryParams);

      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledTimes(2);
      expect(console.error).toBeCalledWith('Non-serializeable query param mockParam!');
      expect(console.error).toBeCalledWith(new TypeError('Converting circular structure to JSON\n    --> starting at object with constructor \'MockParam\'\n    --- property \'prop2\' closes the circle'));
      expect(result).toBeUndefined();
    });
    it('returns undefined for non-string and non-object query params', () => {
      jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
      const paramName = 'mockParam';
      const queryParams = {
        mockParam: true
      };

      const result = parseObjectTypeQueryParam(paramName, queryParams);

      expect(console.error).not.toBeCalled();
      expect(result).toBeUndefined();
    });
  });
  describe('castParametersToDeclaredTypes', () => {

    const mockDashboards = {
      Dashboard1: {
        id: 'Dashboard1',
        route: 'dashboard-1',
        widgetIds: [
          'MockWidget'
        ],
        parameters: [
          {
            name: 'param1',
            type: 'string',
            default: '1'
          },
          {
            name: 'param2',
            type: 'string',
            default: '2'
          }
        ]
      },
      Dashboard2: {
        id: 'Dashboard2',
        route: 'dashboard-2',
        widgetIds: [
          'MockWidget'
        ],
        parameters: [
          {
            name: 'param1',
            type: 'string',
            default: '1'
          },
          {
            name: 'param2',
            type: 'number',
            default: '2'
          }
        ]
      }
    } as unknown as Record<string, DashboardParser>;

    it('returns empty object if there are no parameters', () => {
      const result = castParametersToDeclaredTypes('MockWidget');

      expect(result).toEqual({});
    });
    
    it('uses specified dashboard to check parameter definitions for types when provided', () => {
      const result = castParametersToDeclaredTypes(
        'MockWidget',
        {
          param1: 'abc',
          param2: '12345'
        },
        mockDashboards,
        'Dashboard2'
      );

      expect(result).toEqual({
        param1: 'abc',
        param2: 12345
      });
    });
    
    it('tries to find a dashboard that references the widget and has parameter definitions for passed params when dasboard id is not provided', () => {
      const result = castParametersToDeclaredTypes(
        'MockWidget',
        {
          param1: 'abc',
          param2: '12345'
        },
        mockDashboards
      );

      expect(result).toEqual({
        param1: 'abc',
        param2: '12345'
      });
    });

    it('includes parameters with default values that are not passed as query params', () => {
      const dashboards = cloneDeep(mockDashboards);
      dashboards.Dashboard2.parameters.push(
        {
          name: 'param3',
          default: 'false',
          type: Parameter.type.BOOLEAN
        }
      )
      const result = castParametersToDeclaredTypes(
        'MockWidget',
        {
          param1: 'abc',
          param2: '12345'
        },
        dashboards,
        'Dashboard2'
      );

      expect(result).toEqual({
        param1: 'abc',
        param2: 12345,
        param3: false
      });
    });
  });
  describe('castToType', () => {
    describe('case string', () => {
      it('calls toString on values when type is string', () => {
        const mockToString = jest.fn();
        mockToString.mockReturnValue('value');
        const value = {
          toString: mockToString
        };

        const result = castToType(value, Parameter.type.STRING);

        expect(mockToString).toBeCalled();
        expect(result).toEqual('value');
      });
      it('triggers on \'string\' as well as Parameter.type.STRING', () => {
        const mockToString = jest.fn();
        const value = {
          toString: mockToString
        };

        castToType(value, Parameter.type.STRING);
        castToType(value, 'string');

        expect(mockToString).toBeCalled();
        expect(mockToString).toBeCalledTimes(2);
      });
    });
    describe('case boolean', () => {
      it('returns true for \'true\'', () => {
        const result = castToType('true', Parameter.type.BOOLEAN);

        expect(result).toEqual(true);
      });
      it('returns true for true', () => {
        const result = castToType(true, Parameter.type.BOOLEAN);

        expect(result).toEqual(true);
      });
      it('returns false for \'false\'', () => {
        const result = castToType('false', Parameter.type.BOOLEAN);

        expect(result).toEqual(false);
      });
      it('returns false for false', () => {
        const result = castToType(false, Parameter.type.BOOLEAN);

        expect(result).toEqual(false);
      });
      it('triggers on \'boolean\' as well as Parameter.type.BOOLEAN', () => {
        const result = castToType('true', 'boolean');

        expect(result).toEqual(true);
      });
      it('logs an error for non-castable value and returns original value', () => {
        jest.spyOn(global.console, 'error');

        const result = castToType('abc', Parameter.type.BOOLEAN);

        expect(console.error).toBeCalled();
        expect(console.error).toBeCalledWith('Failed to cast value abc to type boolean!', new Error('Invalid boolean'));
        expect(result).toEqual('abc');
      });
    });
    describe('case date', () => {
      it('returns Date instance', () => {
        const result = castToType('2023-04-07', Parameter.type.DATE);

        expect(result).toEqual(new Date('2023-04-07'));
      });
      it('triggers on \'date\' as well as Parameter.type.DATE', () => {
        const result = castToType(new Date('2023-04-07'), 'date');

        expect(result).toEqual(new Date('2023-04-07'));
      });
      it('logs an error for non-castable value and returns original value', () => {
        jest.spyOn(global.console, 'error');

        const result = castToType('abc', Parameter.type.DATE);

        expect(console.error).toBeCalled();
        expect(console.error).toBeCalledWith('Failed to cast value abc to type date!', new Error('Invalid Date'));
        expect(result).toEqual('abc');
      });
    });
    describe('case number', () => {
      it('returns Number value', () => {
        const result = castToType('123.45', Parameter.type.NUMBER);

        expect(result).toEqual(123.45);
      });
      it('triggers on \'number\' as well as Parameter.type.NUMBER', () => {
        const result = castToType(321, 'number');

        expect(result).toEqual(321);
      });
      it('logs an error for non-castable value and returns original value', () => {
        jest.spyOn(global.console, 'error');

        const result = castToType('abc', Parameter.type.NUMBER);

        expect(console.error).toBeCalled();
        expect(console.error).toBeCalledWith('Failed to cast value abc to type number!', new Error('NaN'));
        expect(result).toEqual('abc');
      });
    });
    it('default', () => {
      jest.spyOn(global.console, 'error');

      const result = castToType('abc', 'nonsense');

      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledWith('Invalid type nonsense!');
      expect(result).toEqual('abc');
    });
  });
});