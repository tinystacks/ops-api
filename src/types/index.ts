import { BaseProvider, BaseWidget } from '@tinystacks/ops-core';

type Json = {
  [key: string]: any
};

type GetWidgetArguments = {
  consoleName: string;
  widgetId: string;
  overrides?: any;
  dashboardId?: string;
  parameters?: any;
};

type HydrateWidgetReferencesArguments = {
  widget: BaseWidget;
  widgets: Record<string, BaseWidget>;
  providers: Record<string, BaseProvider>;
  overrides?: Json;
  parameters?: Json;
};

export {
  Json,
  GetWidgetArguments,
  HydrateWidgetReferencesArguments
};