import isNil from 'lodash.isnil';
import HttpError from 'http-errors';
import ConsoleClient from './console-client/index.js';
import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';
import { Widget } from '@tinystacks/ops-model';
import { BaseWidget } from '@tinystacks/ops-core';

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
      const widget: BaseWidget = console.widgets[widgetId];
      if (isNil(widget)) throw HttpError.NotFound(`Widget with id ${widgetId} does not exist on console ${consoleName}!`);
      const hydratedProviders = (widget.providerIds || []).map((providerId) => {
        return console.providers[providerId];
      });
      await widget.getData(hydratedProviders);
      return widget;
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
      await console.addWidget(widget, widgetId);
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
      await console.updateWidget(widget, widgetId);
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
  }
};
export default WidgetClient;