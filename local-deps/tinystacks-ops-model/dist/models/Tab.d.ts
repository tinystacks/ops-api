import type { Widget } from './Widget';
export type Tab = (Widget & {
    /**
     * A human readable, non-unique name to be displayed
     */
    tabDisplayName: string;
    widgetIds: Array<string>;
});
