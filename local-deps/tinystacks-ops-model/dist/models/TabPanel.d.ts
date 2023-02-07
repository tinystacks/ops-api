import type { Tab } from './Tab';
import type { Widget } from './Widget';
export type TabPanel = (Widget & {
    /**
     * A list of tab widgets to be displayed
     */
    tabs: Record<string, Tab>;
});
