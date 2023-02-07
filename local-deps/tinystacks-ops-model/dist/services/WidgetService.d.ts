import type { TinyStacksError } from '../models/TinyStacksError';
import type { Widget } from '../models/Widget';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class WidgetService {
    /**
     * Creates a Widget
     * @param consoleName Console name
     * @param requestBody
     * @returns Widget the new Widget
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static createWidget(consoleName: string, requestBody: Widget): CancelablePromise<Widget | TinyStacksError>;
    /**
     * Fetches the details for the specified Widget.
     * @param consoleName Console name
     * @param widgetId Widget id
     * @returns Widget A fully hydrated Widget.
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static getWidget(consoleName: string, widgetId: string): CancelablePromise<Array<Widget> | TinyStacksError>;
    /**
     * Updates a Widget
     * @param consoleName Console name
     * @param widgetId Widget id
     * @param requestBody
     * @returns Widget the updated Widget
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static updateWidget(consoleName: string, widgetId: string, requestBody: Widget): CancelablePromise<Widget | TinyStacksError>;
    /**
     * Deletes a Widget
     * @param consoleName Console name
     * @param widgetId Widget id
     * @returns Widget the deleted Widget
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static deleteWidget(consoleName: string, widgetId: string): CancelablePromise<Widget | TinyStacksError>;
}
