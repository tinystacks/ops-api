export type Page = {
    id?: string;
    widgetIds: Array<string>;
    /**
     * A URL-safe route where this page can be accessed
     */
    route: string;
};
