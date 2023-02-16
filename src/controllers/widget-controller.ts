import { Widget as WidgetType } from '@tinystacks/ops-model';
import WidgetClient from '../clients/widget-client';
// temporary until parser is done and can return instances of plugin classes
import { GenericWidget } from '@tinystacks/ops-core';

const WidgetController = {
  async getWidget (consoleName: string, widgetId: string): Promise<WidgetType> {
    return WidgetClient.getWidget(consoleName, widgetId);
  },
  async postWidget (consoleName: string, createWidgetBody: WidgetType): Promise<WidgetType> {
    const widget = GenericWidget.fromJson(createWidgetBody);
    return WidgetClient.createWidget(consoleName, widget);
  },
  async putWidget (consoleName: string, widgetId: string, updateWidgetBody: WidgetType): Promise<WidgetType> {
    const widget = GenericWidget.fromJson(updateWidgetBody);
    widget.id = widgetId;
    return WidgetClient.updateWidget(consoleName, widgetId, widget);
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<WidgetType> {
    return WidgetClient.deleteWidget(consoleName, widgetId);
  }
};

export default WidgetController;