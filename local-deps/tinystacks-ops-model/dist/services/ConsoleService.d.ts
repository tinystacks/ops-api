import type { Console } from '../models/Console';
import type { TinyStacksError } from '../models/TinyStacksError';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ConsoleService {
    /**
     * Fetches the details for all of the Consoles in scope.
     * @returns Console A list of Consoles.
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static getConsoles(): CancelablePromise<Array<Console> | TinyStacksError>;
    /**
     * Creates a Console
     * @param requestBody
     * @returns Console the new Console
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static createConsole(requestBody: Console): CancelablePromise<Console | TinyStacksError>;
    /**
     * Updates a Console
     * @param consoleName Console name
     * @param requestBody
     * @returns Console the updated Console
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static updateConsole(consoleName: string, requestBody: Console): CancelablePromise<Console | TinyStacksError>;
    /**
     * Deletes a Console
     * @param consoleName Console name
     * @returns Console the deleted Console
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static deleteConsole(consoleName: string): CancelablePromise<Console | TinyStacksError>;
}
