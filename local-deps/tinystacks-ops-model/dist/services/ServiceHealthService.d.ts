import type { Ping } from '../models/Ping';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ServiceHealthService {
    /**
     * @returns Ping Returns the string Healthy Connection in an HTTP 200 response
     * @throws ApiError
     */
    static getPing(): CancelablePromise<Ping>;
}
