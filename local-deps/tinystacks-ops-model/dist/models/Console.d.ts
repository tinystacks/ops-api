import type { Page } from './Page';
import type { Provider } from './Provider';
import type { Widget } from './Widget';
/**
 * A console is a top-level construct that defines all
 */
export type Console = {
    /**
     * a human-readable name for your console.
     */
    name: string;
    pages: Record<string, Page>;
    widgets: Record<string, Widget>;
    providers: Record<string, Provider>;
    dependencies?: Record<string, string>;
};
