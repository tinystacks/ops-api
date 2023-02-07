"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ConsoleService {
    /**
     * Fetches the details for all of the Consoles in scope.
     * @returns Console A list of Consoles.
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static getConsoles() {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/consoles',
        });
    }
    /**
     * Creates a Console
     * @param requestBody
     * @returns Console the new Console
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static createConsole(requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/consoles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Updates a Console
     * @param consoleName Console name
     * @param requestBody
     * @returns Console the updated Console
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static updateConsole(consoleName, requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/consoles',
            path: {
                'consoleName': consoleName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Deletes a Console
     * @param consoleName Console name
     * @returns Console the deleted Console
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static deleteConsole(consoleName) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/consoles',
            path: {
                'consoleName': consoleName,
            },
        });
    }
}
exports.ConsoleService = ConsoleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc29sZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9nZW4vc2VydmljZXMvQ29uc29sZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsNkNBQTBDO0FBQzFDLDZDQUF1RDtBQUV2RCxNQUFhLGNBQWM7SUFFekI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsV0FBVztRQUN2QixPQUFPLElBQUEsaUJBQVMsRUFBQyxpQkFBTyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLFdBQVc7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQ3pCLFdBQW9CO1FBRXBCLE9BQU8sSUFBQSxpQkFBUyxFQUFDLGlCQUFPLEVBQUU7WUFDeEIsTUFBTSxFQUFFLE1BQU07WUFDZCxHQUFHLEVBQUUsV0FBVztZQUNoQixJQUFJLEVBQUUsV0FBVztZQUNqQixTQUFTLEVBQUUsa0JBQWtCO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FDekIsV0FBbUIsRUFDbkIsV0FBb0I7UUFFcEIsT0FBTyxJQUFBLGlCQUFTLEVBQUMsaUJBQU8sRUFBRTtZQUN4QixNQUFNLEVBQUUsS0FBSztZQUNiLEdBQUcsRUFBRSxXQUFXO1lBQ2hCLElBQUksRUFBRTtnQkFDSixhQUFhLEVBQUUsV0FBVzthQUMzQjtZQUNELElBQUksRUFBRSxXQUFXO1lBQ2pCLFNBQVMsRUFBRSxrQkFBa0I7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQ3pCLFdBQW1CO1FBRW5CLE9BQU8sSUFBQSxpQkFBUyxFQUFDLGlCQUFPLEVBQUU7WUFDeEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsR0FBRyxFQUFFLFdBQVc7WUFDaEIsSUFBSSxFQUFFO2dCQUNKLGFBQWEsRUFBRSxXQUFXO2FBQzNCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUVGO0FBM0VELHdDQTJFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgKi9cbmltcG9ydCB0eXBlIHsgQ29uc29sZSB9IGZyb20gJy4uL21vZGVscy9Db25zb2xlJztcbmltcG9ydCB0eXBlIHsgVGlueVN0YWNrc0Vycm9yIH0gZnJvbSAnLi4vbW9kZWxzL1RpbnlTdGFja3NFcnJvcic7XG5cbmltcG9ydCB0eXBlIHsgQ2FuY2VsYWJsZVByb21pc2UgfSBmcm9tICcuLi9jb3JlL0NhbmNlbGFibGVQcm9taXNlJztcbmltcG9ydCB7IE9wZW5BUEkgfSBmcm9tICcuLi9jb3JlL09wZW5BUEknO1xuaW1wb3J0IHsgcmVxdWVzdCBhcyBfX3JlcXVlc3QgfSBmcm9tICcuLi9jb3JlL3JlcXVlc3QnO1xuXG5leHBvcnQgY2xhc3MgQ29uc29sZVNlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBGZXRjaGVzIHRoZSBkZXRhaWxzIGZvciBhbGwgb2YgdGhlIENvbnNvbGVzIGluIHNjb3BlLlxuICAgKiBAcmV0dXJucyBDb25zb2xlIEEgbGlzdCBvZiBDb25zb2xlcy5cbiAgICogQHJldHVybnMgVGlueVN0YWNrc0Vycm9yIFRoZSBzcGVjaWZpZWQgcmVzb3VyY2Ugd2FzIG5vdCBmb3VuZFxuICAgKiBAdGhyb3dzIEFwaUVycm9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldENvbnNvbGVzKCk6IENhbmNlbGFibGVQcm9taXNlPEFycmF5PENvbnNvbGU+IHwgVGlueVN0YWNrc0Vycm9yPiB7XG4gICAgcmV0dXJuIF9fcmVxdWVzdChPcGVuQVBJLCB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NvbnNvbGVzJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgQ29uc29sZVxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHlcbiAgICogQHJldHVybnMgQ29uc29sZSB0aGUgbmV3IENvbnNvbGVcbiAgICogQHJldHVybnMgVGlueVN0YWNrc0Vycm9yIFRoZSBzcGVjaWZpZWQgcmVzb3VyY2Ugd2FzIG5vdCBmb3VuZFxuICAgKiBAdGhyb3dzIEFwaUVycm9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNvbnNvbGUoXG4gICAgcmVxdWVzdEJvZHk6IENvbnNvbGUsXG4gICk6IENhbmNlbGFibGVQcm9taXNlPENvbnNvbGUgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NvbnNvbGVzJyxcbiAgICAgIGJvZHk6IHJlcXVlc3RCb2R5LFxuICAgICAgbWVkaWFUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhIENvbnNvbGVcbiAgICogQHBhcmFtIGNvbnNvbGVOYW1lIENvbnNvbGUgbmFtZVxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHlcbiAgICogQHJldHVybnMgQ29uc29sZSB0aGUgdXBkYXRlZCBDb25zb2xlXG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB1cGRhdGVDb25zb2xlKFxuICAgIGNvbnNvbGVOYW1lOiBzdHJpbmcsXG4gICAgcmVxdWVzdEJvZHk6IENvbnNvbGUsXG4gICk6IENhbmNlbGFibGVQcm9taXNlPENvbnNvbGUgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmw6ICcvY29uc29sZXMnLFxuICAgICAgcGF0aDoge1xuICAgICAgICAnY29uc29sZU5hbWUnOiBjb25zb2xlTmFtZSxcbiAgICAgIH0sXG4gICAgICBib2R5OiByZXF1ZXN0Qm9keSxcbiAgICAgIG1lZGlhVHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYSBDb25zb2xlXG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHJldHVybnMgQ29uc29sZSB0aGUgZGVsZXRlZCBDb25zb2xlXG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBkZWxldGVDb25zb2xlKFxuICAgIGNvbnNvbGVOYW1lOiBzdHJpbmcsXG4gICk6IENhbmNlbGFibGVQcm9taXNlPENvbnNvbGUgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6ICcvY29uc29sZXMnLFxuICAgICAgcGF0aDoge1xuICAgICAgICAnY29uc29sZU5hbWUnOiBjb25zb2xlTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxufVxuIl19