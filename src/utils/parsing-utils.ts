import isEqual from 'lodash.isequal';
import { Parameter } from '@tinystacks/ops-model';
import { DashboardParser } from '@tinystacks/ops-core';
import { Json } from '../types/index.js';

function parseObjectTypeQueryParam (paramName: string, queryParams: any = {}) {
  const queryParam = queryParams[paramName];
  let queryParamObject: any = undefined;
  if (typeof queryParam === 'string') {
    try {
      queryParamObject = JSON.parse(queryParam);
    } catch (e) {
      console.error(`Non-parseable query param ${paramName}`);
      console.error(e);
    }
  } else if (typeof queryParam === 'object') {
    try {
      // make sure it is serializeable JSON
      queryParamObject = JSON.parse(JSON.stringify(queryParam));
    } catch (e) {
      console.error(`Non-serializeable query param ${paramName}`);
      console.error(e);
    }
  }
  return queryParamObject;
}

function castToType (value: any, type: Parameter.type | string) {
  try {
    switch (type) {
      case Parameter.type.STRING:
        return value.toString();
      case Parameter.type.BOOLEAN:
        return value === 'true';
      case Parameter.type.DATE:
        return new Date(value);
      case Parameter.type.NUMBER: {
        const numValue = Number(value);
        if (Number.isNaN(numValue)) {
          throw new Error(numValue.toString());
        }
        return numValue;
      }
      default:
        console.error(`Invalid parameter type ${type}!`);
        return value;
    }
  } catch (error) {
    console.error(`Failed to cast value ${value} to type ${type}!`, error);
    return value;
  }
}

function castParametersToDeclaredTypes (widgetId: string, parameters: Json = {}, dashboards: Record<string, DashboardParser> = {}, dashboardId?: string): Json {
  if (Object.keys(parameters).length > 0) {
    const parameterKeys = Object.keys(parameters).sort();
    const dashboardContext = dashboardId ?
      dashboards[dashboardId] :
      Object.values(dashboards).find((dashboard) => {
        const parameterNames = dashboard.parameters.map(param => param.name).sort();
        return (
          dashboard.widgetIds.includes(widgetId) &&
          isEqual(parameterKeys, parameterNames)
        );
      });

    if (dashboardContext) {
      return Object.fromEntries(
        Object.entries(parameters).map(([key, value]) => {
          const parameterDefinition = dashboardContext.parameters.find(param => param.name === key);
          const parameterType = parameterDefinition.type || 'string';
          const castValue = castToType(value, parameterType);
          return [key, castValue];
        })
      );
    }
  }
  return parameters;
}

export {
  parseObjectTypeQueryParam,
  castParametersToDeclaredTypes
};