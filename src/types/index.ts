import { BaseProvider, BaseWidget, DashboardParser } from '@tinystacks/ops-core';
import { Constant, Widget } from '@tinystacks/ops-model';

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
  constants?: Record<string, Constant>;
  dashboards: Record<string, DashboardParser>;
  dashboardId?: string;
};

type ResolveWidgetPropertyReferencesArguments = {
  property: any;
  widgets: Record<string, BaseWidget>;
  providers: Record<string, BaseProvider>;
  referencedWidgets: Record<string, Widget>;
  parameters?: Json;
  constants?: Record<string, Constant>;
  dashboards: Record<string, DashboardParser>;
  dashboardId?: string;
}

export {
  Json,
  GetWidgetArguments,
  HydrateWidgetReferencesArguments,
  ResolveWidgetPropertyReferencesArguments
};