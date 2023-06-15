import { Widget, Provider, Dashboard } from '@tinystacks/ops-core';
import { Constant, Widget as WidgetType } from '@tinystacks/ops-model';

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
  widget: Widget;
  widgets: Record<string, Widget>;
  providers: Record<string, Provider>;
  overrides?: Json;
  parameters?: Json;
  constants?: Record<string, Constant>;
  dashboards: Record<string, Dashboard>;
  dashboardId?: string;
};

type ResolveWidgetPropertyReferencesArguments = {
  property: any;
  widgets: Record<string, Widget>;
  providers: Record<string, Provider>;
  referencedWidgets: Record<string, WidgetType>;
  parameters?: Json;
  constants?: Record<string, Constant>;
  dashboards: Record<string, Dashboard>;
  dashboardId?: string;
}

export {
  Json,
  GetWidgetArguments,
  HydrateWidgetReferencesArguments,
  ResolveWidgetPropertyReferencesArguments
};