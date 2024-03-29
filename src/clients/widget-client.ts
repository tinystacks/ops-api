import isNil from 'lodash.isnil';
import HttpError from 'http-errors';
import ConsoleClient from './console-client/index.js';
import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';
import get from 'lodash.get';
import { Widget } from '@tinystacks/ops-model';
import { BaseWidget } from '@tinystacks/ops-core';
import {
  GetWidgetArguments,
  HydrateWidgetReferencesArguments,
  ResolveWidgetPropertyReferencesArguments
} from '../types/index.js';
import { castParametersToDeclaredTypes, castToType } from '../utils/parsing-utils.js';

// TODO: should we make this a class that implement a WidgetClient interface?
const WidgetClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message = error.message?.replaceAll('console', 'widget');
      }
    }
    throw error;
  },
  async getWidget (args: GetWidgetArguments): Promise<BaseWidget> {
    try {
      const {
        consoleName,
        widgetId,
        overrides,
        dashboardId,
        parameters = {}
      } = args;
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const widget: BaseWidget = console.widgets[widgetId];
      if (isNil(widget)) throw HttpError.NotFound(`Widget with id ${widgetId} does not exist on console ${consoleName}!`);
      const { widgets, providers, dashboards = {}, constants = {} } = console;
      const typeCastParameters = castParametersToDeclaredTypes(widgetId, parameters, dashboards, dashboardId);
      const hydratedWidget = await this.hydrateWidgetReferences({
        widget,
        widgets,
        providers,
        overrides,
        parameters: typeCastParameters,
        constants,
        dashboards,
        dashboardId
      });
      return hydratedWidget;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createWidget (consoleName: string, widget: Widget): Promise<BaseWidget> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const widgetId = widget.id || upperFirst(camelCase(widget.displayName));
      widget.id = widgetId;
      const existingWidget = console.widgets[widgetId];
      if (existingWidget) throw HttpError.Conflict(`Cannot create new widget with id ${widget.id} because a widget with this id already exists on console ${consoleName}!`);
      // Filter out any junk from the request
      const widgetDependencySource = console.dependencies[widget.type];
      const widgetInstance = await BaseWidget.fromJson(widget, widgetDependencySource);
      const newWidget = widgetInstance.toJson();
      await console.addWidget(newWidget, widgetId);
      await consoleClient.saveConsole(consoleName, console);
      return this.getWidget({ consoleName, widgetId: widget.id });
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updateWidget (consoleName: string, widgetId: string, widget: Widget): Promise<BaseWidget> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const existingWidget = console.widgets[widgetId];
      if (isNil(existingWidget)) throw HttpError.NotFound(`Cannot update widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      // No trickery allowed.
      widget.id = widgetId;
      // Filter out any junk from the request
      const widgetDependencySource = console.dependencies[widget.type];
      const widgetInstance = await BaseWidget.fromJson(widget, widgetDependencySource);
      const updatedWidget = widgetInstance.toJson();
      await console.updateWidget(updatedWidget, widgetId);
      await consoleClient.saveConsole(console.name, console);
      return this.getWidget({ consoleName, widgetId: widget.id });
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<BaseWidget> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const existingWidget = console.widgets[widgetId];
      if (isNil(existingWidget)) throw HttpError.NotFound(`Cannot delete widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      console.deleteWidget(widgetId);
      await consoleClient.saveConsole(console.name, console);
      return existingWidget;
    } catch (error) {
      return this.handleError(error);
    }
  },
  // recursively look through properties for refs <- recA
  //   recursively for every ref:
  //      recA
  //      resolve ref by calling getData
  async hydrateWidgetReferences (args: HydrateWidgetReferencesArguments) {
    const {
      widget,
      widgets,
      providers,
      overrides,
      parameters,
      constants,
      dashboards,
      dashboardId
    } = args;
    const referencedWidgets: Record<string, Widget> = {};
    const resolvedWidget = await this.resolveWidgetPropertyReferences({
      property: widget,
      widgets,
      providers,
      referencedWidgets,
      parameters,
      constants,
      dashboards,
      dashboardId
    });


    const hydratedProviders = ((resolvedWidget as Widget).providerIds || []).map((providerId: string) => {
      return providers[providerId];
    });
    await widget.getData(hydratedProviders, overrides, parameters);
    return widget;
  },
  async resolveWidgetPropertyReferences (
    args: ResolveWidgetPropertyReferencesArguments
  ): Promise<any> {
    const {
      property,
      widgets,
      providers,
      referencedWidgets,
      parameters = {},
      constants = {},
      dashboards,
      dashboardId
    } = args;
    const parameterPrefix = '$param.';
    const constantPrefix = '$const.';
    if (typeof property === 'object') {
      // TODO: Sort out this ref tracing in core
      // TODO: Cycle detection (also in core)
      if (Array.isArray(property)) {
        for (const i in property) {
          property[i] = await this.resolveWidgetPropertyReferences({
            property: property[i],
            widgets,
            providers,
            referencedWidgets,
            parameters,
            constants,
            dashboards,
            dashboardId
          });
        }
        return property;
      } else if ('$ref' in property) {
        return await this.resolveWidgetPropertyReference({
          property,
          widgets,
          providers,
          referencedWidgets,
          parameters,
          constants,
          dashboards,
          dashboardId
        });
      } else {
        for (const p in property) {
          property[p] = await this.resolveWidgetPropertyReferences({
            property: property[p],
            widgets,
            providers,
            referencedWidgets,
            parameters,
            constants,
            dashboards,
            dashboardId
          });
        }
      }
    } else if (typeof property === 'string') {
      let subbedProperty = property;
      if (subbedProperty.includes(parameterPrefix)) {
        const lines = subbedProperty.split('\n');
        subbedProperty = lines.map((line) => {
          const elems = line.split(' ');
          const filtered = elems.filter(elem => elem.trim().length > 0);
          if (filtered.length === 1) {
            const paramName = filtered.at(0).split(parameterPrefix).at(1);
            const paramValue = parameters[paramName];
            return !isNil(paramValue) ? paramValue : elems.join(' ');
          } else {
            return elems.map((elem: string) => {
              if (elem.startsWith(parameterPrefix)) {
                const paramName = elem.split(parameterPrefix).at(1)?.trim();
                const paramValue = parameters[paramName];
                return !isNil(paramValue) ? paramValue : elem;
              }
              return elem;
            }).join(' ');
          }
        }).join('\n');
      }
      if (subbedProperty.includes(constantPrefix)) {
        const lines = subbedProperty.split('\n');
        subbedProperty = lines.map((line) => {
          const elems = line.split(' ');
          const filtered = elems.filter(elem => elem.trim().length > 0);
          if (filtered.length === 1) {
            const constName = filtered.at(0).split(constantPrefix).at(1);
            const constant = constants[constName];
            const constValue = constant?.value;
            const constType = constant?.type;
            const castConstType = constValue && constType ? castToType(constValue, constType) : constValue;
            return !isNil(castConstType) ? castConstType : elems.join(' ');
          } else {
            return elems.map((elem: string) => {
              if (elem.startsWith(constantPrefix)) {
                const constName = elem.split(constantPrefix).at(1)?.trim();
                const constant = constants[constName];
                const constValue = constant?.value;
                const constType = constant?.type;
                const castConstType = constValue && constType ? castToType(constValue, constType) : constValue;
                return !isNil(castConstType) ? castConstType : elem;
              }
              return elem;
            }).join(' ');
          }
        }).join('\n');
      }
      return subbedProperty;
    }

    return property;
  },
  async resolveWidgetPropertyReference (args: ResolveWidgetPropertyReferencesArguments) {
    const {
      property,
      widgets,
      providers,
      referencedWidgets,
      parameters = {},
      constants = {},
      dashboards,
      dashboardId
    } = args;
    const widgetId = property.$ref.split('/')[3];
    const refWidget = widgets[widgetId];
    if (!referencedWidgets[refWidget.id]) {
      let params = parameters;
      if (Object.keys(parameters).length === 0) {
        params = castParametersToDeclaredTypes(widgetId, parameters, dashboards, dashboardId);
      }
      referencedWidgets[refWidget.id] = await this.hydrateWidgetReferences({
        widget: refWidget,
        widgets,
        providers,
        parameters: params,
        constants,
        dashboards,
        dashboardId
      });
    }
    const fullRefWidget = referencedWidgets[refWidget.id];
    const resolvedReference = ('path' in property) ? get(fullRefWidget, property.path) : fullRefWidget;
    return resolvedReference;
  }
};

export default WidgetClient;