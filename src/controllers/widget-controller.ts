import { Widget } from '@tinystacks/ops-model';
import WidgetClient from '../clients/widget-client.js';

const WidgetController = {
  async getWidget (consoleName: string, widgetId: string): Promise<Widget> {
    return (await WidgetClient.getWidget(consoleName, widgetId)).toJson();
  },
  async postWidget (consoleName: string, createWidgetBody: Widget): Promise<Widget> {
    return (await WidgetClient.createWidget(consoleName, createWidgetBody)).toJson();
  },
  async putWidget (consoleName: string, widgetId: string, updateWidgetBody: Widget): Promise<Widget> {
    updateWidgetBody.id = widgetId;
    return (await WidgetClient.updateWidget(consoleName, widgetId, updateWidgetBody)).toJson();
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<Widget> {
    return (await WidgetClient.deleteWidget(consoleName, widgetId)).toJson();
  }
};

export default WidgetController;