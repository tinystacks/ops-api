import { Widget as WidgetType } from '@tinystacks/ops-model';
import WidgetClient from '../clients/widget-client';
// temporary until parser is done and can return instances of plugin classes
import { WidgetParser } from '@tinystacks/ops-core';

const WidgetController = {
  async getWidget (consoleName: string, widgetId: string): Promise<WidgetType> {
    return (await WidgetClient.getWidget(consoleName, widgetId)).toJson();
  },
  async postWidget (consoleName: string, createWidgetBody: WidgetType): Promise<WidgetType> {
    const widget = WidgetParser.fromJson(createWidgetBody);
    return (await WidgetClient.createWidget(consoleName, widget)).toJson();
  },
  async putWidget (consoleName: string, widgetId: string, updateWidgetBody: WidgetType): Promise<WidgetType> {
    const widget = WidgetParser.fromJson(updateWidgetBody);
    widget.id = widgetId;
    return (await WidgetClient.updateWidget(consoleName, widgetId, widget)).toJson();
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<WidgetType> {
    return (await WidgetClient.deleteWidget(consoleName, widgetId)).toJson();
  }
};

export default WidgetController;