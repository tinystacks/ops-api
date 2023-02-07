import type { Page } from '../models/Page';
import type { TinyStacksError } from '../models/TinyStacksError';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class PageService {
    /**
     * Fetches the details for all of the Pages in the specified Console.
     * @param consoleName Console name
     * @returns Page A list of Pages.
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static getPages(consoleName: string): CancelablePromise<Array<Page> | TinyStacksError>;
    /**
     * Creates a Page
     * @param consoleName Console name
     * @param requestBody
     * @returns Page the new Page
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static createPage(consoleName: string, requestBody: Page): CancelablePromise<Page | TinyStacksError>;
    /**
     * Updates a Page
     * @param consoleName Console name
     * @param pageId Page id
     * @param requestBody
     * @returns Page the updated Page
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static updatePage(consoleName: string, pageId: string, requestBody: Page): CancelablePromise<Page | TinyStacksError>;
    /**
     * Deletes a Page
     * @param consoleName Console name
     * @param pageId Page id
     * @returns Page the deleted Page
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static deletePage(consoleName: string, pageId: string): CancelablePromise<Page | TinyStacksError>;
}
