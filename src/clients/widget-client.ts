import isNil from 'lodash.isnil';
import HttpError from 'http-errors';
import ConsoleClient from './console-client/index.js';
import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';
import get from 'lodash.get';
import { Widget } from '@tinystacks/ops-model';
import { BaseProvider, BaseWidget } from '@tinystacks/ops-core';

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
  async getWidget (consoleName: string, widgetId: string, overrides?: any): Promise<BaseWidget> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const widget: BaseWidget = console.widgets[widgetId];
      if (isNil(widget)) throw HttpError.NotFound(`Widget with id ${widgetId} does not exist on console ${consoleName}!`);
      return await this.hydrateWidgetReferences(widget, console.widgets, console.providers, overrides);
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
      return this.getWidget(consoleName, widget.id);
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
      return this.getWidget(consoleName, widget.id);
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
  async hydrateWidgetReferences (widget: any, consoleWidgets: Record<string, BaseWidget>, consoleProviders: Record<string, BaseProvider>,  overrides?: any) {
    const referencedWidgets: Record<string, Widget> = {};
    const resolvedWidget = await this.resolveWidgetPropertyReferences(widget, consoleWidgets, consoleProviders, referencedWidgets);


    const hydratedProviders = ((resolvedWidget as Widget).providerIds || []).map((providerId: string) => {
      return consoleProviders[providerId];
    });
    await widget.getData(hydratedProviders,  overrides);
    return widget;
  },
  async resolveWidgetPropertyReferences (
    property: any, widgets: Record<string, BaseWidget>, providers: Record<string, BaseProvider>, 
    referencedWidgets: Record<string, Widget>
  ): Promise<any> {
    if (typeof(property) === 'object') {
      // TODO: Sort out this ref tracing in core
      // TODO: Cycle detection (also in core)
      if (Array.isArray(property)) {
        for (const i in property) {
          property[i] = await this.resolveWidgetPropertyReferences(property[i], widgets, providers, referencedWidgets);
        }
        return property;
      }
      else if ('$ref' in property) {
        return await this.resolveWidgetPropertyReference(property, widgets, providers, referencedWidgets);
      } else {
        for (const p in property) {
          property[p] = await this.resolveWidgetPropertyReferences(property[p], widgets, providers, referencedWidgets);
        }
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
      referencedWidgets[refWidget.id] = await this.hydrateWidgetReferences(refWidget, widgets, providers);
    }
    const fullRefWidget = referencedWidgets[refWidget.id];
    return ('path' in property) ? get(fullRefWidget, property.path) : fullRefWidget;
  }
};

export default WidgetClient;