import { Constant, Parameter } from '@tinystacks/ops-model';
import { Dashboard } from '@tinystacks/ops-core';
import { Json } from '../types/index.js';
import difference from 'lodash.difference';

function parseObjectTypeQueryParam (paramName: string, queryParams: any = {}) {
  const queryParam = queryParams[paramName];
  let queryParamObject: any = undefined;
  if (typeof queryParam === 'string') {
    try {
      queryParamObject = JSON.parse(queryParam);
    } catch (e) {
      console.error(`Non-parseable query param ${paramName}!`);
      console.error(e);
    }
  } else if (typeof queryParam === 'object') {
    try {
      // make sure it is serializeable JSON
      queryParamObject = JSON.parse(JSON.stringify(queryParam));
    } catch (e) {
      console.error(`Non-serializeable query param ${paramName}!`);
      console.error(e);
    }
  }
  return queryParamObject;
}

function castToType (value: any, type: Constant.type | Parameter.type | string) {
  try {
    switch (type) {
      case Parameter.type.STRING || Constant.type.STRING:
        return value.toString();
      case Parameter.type.BOOLEAN || Constant.type.BOOLEAN:
        if (value === 'true' || value === true) {
          return true;
        } else if (value === 'false' || value === false) {
          return false;
        }
        throw new Error('Invalid boolean');
      case Parameter.type.DATE || Constant.type.DATE: {
        const dateValue = new Date(value);
        const dateString = dateValue.toString();
        if (dateString !== 'Invalid Date') return dateValue;
        throw new Error(dateString);
      }
      case Parameter.type.NUMBER|| Constant.type.NUMBER: {
        const numValue = Number(value);
        if (Number.isNaN(numValue)) {
          throw new Error(numValue.toString());
        }
        return numValue;
      }
      default:
        console.error(`Invalid type ${type}!`);
        return value;
    }
  } catch (error) {
    console.error(`Failed to cast value ${value} to type ${type}!`, error);
    return value;
  }
}

function castParametersToDeclaredTypes (widgetId: string, parameters: Json = {}, dashboards: Record<string, Dashboard> = {}, dashboardId?: string): Json {
  const parameterKeys = Object.keys(parameters).sort();
  const dashboardContext = dashboardId ?
    dashboards[dashboardId] :
    Object.values(dashboards).find((dashboard) => {
      const parameterNames = dashboard.parameters.map(param => param.name).sort();
      const dashboardUsesWidget = dashboard.widgetIds.includes(widgetId);
      const dashboardDefinesAllPassesParams = difference(parameterKeys, parameterNames).length === 0;
      const noParamsWerePassed = parameterKeys.length === 0;
      const dashboardPredicateResult = (
        dashboardUsesWidget &&
        (
          dashboardDefinesAllPassesParams ||
          noParamsWerePassed
        )
      );
      return dashboardPredicateResult;
    });

  if (dashboardContext) {
    const castParameters = Object.fromEntries(
      Object.entries(parameters).map(([key, value]) => {
        const parameterDefinition = dashboardContext.parameters.find(param => param.name === key);
        const parameterType = parameterDefinition?.type || 'string';
        const castValue = castToType(value, parameterType);
        return [key, castValue];
      })
    );
    const existingParams = Object.keys(castParameters);
    const defaultParameters = dashboardContext.parameters.filter(param => !existingParams.includes(param.name))
      .reduce((acc: Json, param: Parameter): Json => {
        const {
          name,
          type,
          default: defaultValue
        } = param;

        if (defaultValue) {
          acc[name] = type ? castToType(defaultValue, type) : defaultValue;
        }

        return acc;
      }, {});
    return {
      ...defaultParameters,
      ...castParameters
    };
  }
  return parameters;
}

export {
  parseObjectTypeQueryParam,
  castToType,
  castParametersToDeclaredTypes
};