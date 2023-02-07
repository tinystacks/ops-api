export type Widget = {
    id?: string;
    /**
     * A human-readable display name, usually used to title a widget
     */
    displayName: string;
    /**
     * This describes how this widget should be rendered. The "type" should be equivalent to the Object definition's name of the widget you are trying to render.
     */
    type: string;
    providerId: string;
    /**
     * Whether to show the display name
     */
    showDisplayName?: boolean;
    description?: string;
    /**
     * Whether to show the description
     */
    showDescription?: boolean;
    additionalProperties?: any;
};
