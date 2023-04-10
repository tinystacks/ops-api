import isNil from 'lodash.isnil';
import HttpError from 'http-errors';
import ConsoleClient from './console-client/index.js';
import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';
import get from 'lodash.get';
import { Widget } from '@tinystacks/ops-model';
import { BaseProvider, BaseWidget } from '@tinystacks/ops-core';
import {
  GetWidgetArguments,
  HydrateWidgetReferencesArguments,
  ResolveWidgetPropertyReferencesArguments
} from '../types/index.js';
import { castParametersToDeclaredTypes } from '../utils/parsing-utils.js';

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
      const { widgets, providers, dashboards = {} } = console;
      const typeCastParameters = castParametersToDeclaredTypes(widgetId, parameters, dashboards, dashboardId);
      return await this.hydrateWidgetReferences({
        widget,
        widgets,
        providers,
        overrides,
        parameters: typeCastParameters
      });
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
      parameters
    } = args;
    const referencedWidgets: Record<string, Widget> = {};
    const resolvedWidget = await this.resolveWidgetPropertyReferences({
      property: widget,
      widgets,
      providers,
      referencedWidgets,
      parameters
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
      parameters = {}
    } = args;
    const parameterPrefix = '$param.';
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
            parameters
          });
        }
        return property;
      } else if ('$ref' in property) {
        return await this.resolveWidgetPropertyReference(property, widgets, providers, referencedWidgets);
      } else {
        for (const p in property) {
          property[p] = await this.resolveWidgetPropertyReferences({
            property: property[p],
            widgets,
            providers,
            referencedWidgets,
            parameters
          });
        }
      }
    } else if (typeof property === 'string' && property.includes(parameterPrefix)) {
      const elems = property.split(' ');
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
    }

    return property;
  },
  async resolveWidgetPropertyReference (
    property: any, widgets: Record<string, BaseWidget>, providers: Record<string, BaseProvider>,
    referencedWidgets: Record<string, Widget>
  ) {
    const widgetId = property.$ref.split('/')[3];
    const refWidget = widgets[widgetId];
    if (!referencedWidgets[refWidget.id]) {
      referencedWidgets[refWidget.id] = await this.hydrateWidgetReferences({
        widget: refWidget,
        widgets,
        providers
      });
    }
    const fullRefWidget = referencedWidgets[refWidget.id];
    return ('path' in property) ? get(fullRefWidget, property.path) : fullRefWidget;
  }
};

export default WidgetClient;