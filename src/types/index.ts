import { BaseProvider, BaseWidget } from '@tinystacks/ops-core';
import { Widget } from '@tinystacks/ops-model';

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

type ResolveWidgetPropertyReferencesArguments = {
  property: any;
  widgets: Record<string, BaseWidget>;
  providers: Record<string, BaseProvider>;
  referencedWidgets: Record<string, Widget>;
  parameters?: Json;
}

export {
  Json,
  GetWidgetArguments,
  HydrateWidgetReferencesArguments,
  ResolveWidgetPropertyReferencesArguments
};