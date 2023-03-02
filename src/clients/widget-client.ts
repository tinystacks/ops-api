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
  async getWidget (consoleName: string, widgetId: string): Promise<BaseWidget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const widget = console.widgets[widgetId];
      if (isNil(widget)) throw HttpError.NotFound(`Widget with id ${widgetId} does not exist on console ${consoleName}!`);
      return await this.hydrateWidgetReferences(widget, console.widgets, console.providers);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createWidget (consoleName: string, widget: Widget): Promise<BaseWidget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const widgetId = widget.id || upperFirst(camelCase(widget.displayName));
      widget.id = widgetId;
      const existingWidget = console.widgets[widgetId];
      if (existingWidget) throw HttpError.Conflict(`Cannot create new widget with id ${widget.id} because a widget with this id already exists on console ${consoleName}!`);
      // Filter out any junk from the request
      const widgetDependencySource = console.dependencies[widget.type];
      const widgetInstance = await BaseWidget.fromJson(widget, widgetDependencySource);
      const newWidget = widgetInstance.toJson();
      await console.addWidget(newWidget, widgetId);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getWidget(consoleName, widget.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updateWidget (consoleName: string, widgetId: string, widget: Widget): Promise<BaseWidget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidget = console.widgets[widgetId];
      if (isNil(existingWidget)) throw HttpError.NotFound(`Cannot update widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      // No trickery allowed.
      widget.id = widgetId;
      // Filter out any junk from the request
      const widgetDependencySource = console.dependencies[widget.type];
      const widgetInstance = await BaseWidget.fromJson(widget, widgetDependencySource);
      const updatedWidget = widgetInstance.toJson();
      await console.updateWidget(updatedWidget, widgetId);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getWidget(consoleName, widget.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<BaseWidget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidget = console.widgets[widgetId];
      if (isNil(existingWidget)) throw HttpError.NotFound(`Cannot delete widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      console.deleteWidget(widgetId);
      await ConsoleClient.saveConsole(console.name, console);
      return existingWidget;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async hydrateWidgetReferences (widget: any, consoleWidgets: Record<string, BaseWidget>, consoleProviders: Record<string, BaseProvider>) {

    const referencedWidgets: Record<string, Widget> = {};
    for (const property in widget) {
      if (typeof widget[property] === 'object' && '$ref' in widget[property]) {
        const [_, __, ___, widgetId] = widget[property].$ref.split('/');
        const refWidget = consoleWidgets[widgetId];
        let fullRefWidget;
        if (referencedWidgets[refWidget.id]) {
          fullRefWidget = referencedWidgets[refWidget.id];
        } else {
          fullRefWidget = await this.hydrateWidgetReferences(refWidget, consoleWidgets, consoleProviders);
          referencedWidgets[fullRefWidget.id] = fullRefWidget;
        }
        if ('path' in widget[property]) {
          const value = get(fullRefWidget, widget[property].path);
          widget[property] = value;
        } else {
          widget[property] = fullRefWidget;
        }
      }
    }
    const hydratedProviders = (widget.providerIds || []).map((providerId: string) => {
      return consoleProviders[providerId];
    });
    await widget.getData(hydratedProviders);
    return widget;
  }
};

export default WidgetClient;