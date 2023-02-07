"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class PageService {
    /**
     * Fetches the details for all of the Pages in the specified Console.
     * @param consoleName Console name
     * @returns Page A list of Pages.
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static getPages(consoleName) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/consoles/{consoleName}/pages',
            path: {
                'consoleName': consoleName,
            },
        });
    }
    /**
     * Creates a Page
     * @param consoleName Console name
     * @param requestBody
     * @returns Page the new Page
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static createPage(consoleName, requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/consoles/{consoleName}/pages',
            path: {
                'consoleName': consoleName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Updates a Page
     * @param consoleName Console name
     * @param pageId Page id
     * @param requestBody
     * @returns Page the updated Page
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static updatePage(consoleName, pageId, requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/consoles/{consoleName}/pages/{pageId}',
            path: {
                'consoleName': consoleName,
                'pageId': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Deletes a Page
     * @param consoleName Console name
     * @param pageId Page id
     * @returns Page the deleted Page
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static deletePage(consoleName, pageId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/consoles/{consoleName}/pages/{pageId}',
            path: {
                'consoleName': consoleName,
                'pageId': pageId,
            },
        });
    }
}
exports.PageService = PageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9nZW4vc2VydmljZXMvUGFnZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsNkNBQTBDO0FBQzFDLDZDQUF1RDtBQUV2RCxNQUFhLFdBQVc7SUFFdEI7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FDcEIsV0FBbUI7UUFFbkIsT0FBTyxJQUFBLGlCQUFTLEVBQUMsaUJBQU8sRUFBRTtZQUN4QixNQUFNLEVBQUUsS0FBSztZQUNiLEdBQUcsRUFBRSwrQkFBK0I7WUFDcEMsSUFBSSxFQUFFO2dCQUNKLGFBQWEsRUFBRSxXQUFXO2FBQzNCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUN0QixXQUFtQixFQUNuQixXQUFpQjtRQUVqQixPQUFPLElBQUEsaUJBQVMsRUFBQyxpQkFBTyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsR0FBRyxFQUFFLCtCQUErQjtZQUNwQyxJQUFJLEVBQUU7Z0JBQ0osYUFBYSxFQUFFLFdBQVc7YUFDM0I7WUFDRCxJQUFJLEVBQUUsV0FBVztZQUNqQixTQUFTLEVBQUUsa0JBQWtCO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQ3RCLFdBQW1CLEVBQ25CLE1BQWMsRUFDZCxXQUFpQjtRQUVqQixPQUFPLElBQUEsaUJBQVMsRUFBQyxpQkFBTyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLHdDQUF3QztZQUM3QyxJQUFJLEVBQUU7Z0JBQ0osYUFBYSxFQUFFLFdBQVc7Z0JBQzFCLFFBQVEsRUFBRSxNQUFNO2FBQ2pCO1lBQ0QsSUFBSSxFQUFFLFdBQVc7WUFDakIsU0FBUyxFQUFFLGtCQUFrQjtTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQ3RCLFdBQW1CLEVBQ25CLE1BQWM7UUFFZCxPQUFPLElBQUEsaUJBQVMsRUFBQyxpQkFBTyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLEdBQUcsRUFBRSx3Q0FBd0M7WUFDN0MsSUFBSSxFQUFFO2dCQUNKLGFBQWEsRUFBRSxXQUFXO2dCQUMxQixRQUFRLEVBQUUsTUFBTTthQUNqQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FFRjtBQTVGRCxrQ0E0RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuLyogdHNsaW50OmRpc2FibGUgKi9cbi8qIGVzbGludC1kaXNhYmxlICovXG5pbXBvcnQgdHlwZSB7IFBhZ2UgfSBmcm9tICcuLi9tb2RlbHMvUGFnZSc7XG5pbXBvcnQgdHlwZSB7IFRpbnlTdGFja3NFcnJvciB9IGZyb20gJy4uL21vZGVscy9UaW55U3RhY2tzRXJyb3InO1xuXG5pbXBvcnQgdHlwZSB7IENhbmNlbGFibGVQcm9taXNlIH0gZnJvbSAnLi4vY29yZS9DYW5jZWxhYmxlUHJvbWlzZSc7XG5pbXBvcnQgeyBPcGVuQVBJIH0gZnJvbSAnLi4vY29yZS9PcGVuQVBJJztcbmltcG9ydCB7IHJlcXVlc3QgYXMgX19yZXF1ZXN0IH0gZnJvbSAnLi4vY29yZS9yZXF1ZXN0JztcblxuZXhwb3J0IGNsYXNzIFBhZ2VTZXJ2aWNlIHtcblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgZGV0YWlscyBmb3IgYWxsIG9mIHRoZSBQYWdlcyBpbiB0aGUgc3BlY2lmaWVkIENvbnNvbGUuXG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHJldHVybnMgUGFnZSBBIGxpc3Qgb2YgUGFnZXMuXG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRQYWdlcyhcbiAgICBjb25zb2xlTmFtZTogc3RyaW5nLFxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxBcnJheTxQYWdlPiB8IFRpbnlTdGFja3NFcnJvcj4ge1xuICAgIHJldHVybiBfX3JlcXVlc3QoT3BlbkFQSSwge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jb25zb2xlcy97Y29uc29sZU5hbWV9L3BhZ2VzJyxcbiAgICAgIHBhdGg6IHtcbiAgICAgICAgJ2NvbnNvbGVOYW1lJzogY29uc29sZU5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBQYWdlXG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHBhcmFtIHJlcXVlc3RCb2R5XG4gICAqIEByZXR1cm5zIFBhZ2UgdGhlIG5ldyBQYWdlXG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcmVhdGVQYWdlKFxuICAgIGNvbnNvbGVOYW1lOiBzdHJpbmcsXG4gICAgcmVxdWVzdEJvZHk6IFBhZ2UsXG4gICk6IENhbmNlbGFibGVQcm9taXNlPFBhZ2UgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NvbnNvbGVzL3tjb25zb2xlTmFtZX0vcGFnZXMnLFxuICAgICAgcGF0aDoge1xuICAgICAgICAnY29uc29sZU5hbWUnOiBjb25zb2xlTmFtZSxcbiAgICAgIH0sXG4gICAgICBib2R5OiByZXF1ZXN0Qm9keSxcbiAgICAgIG1lZGlhVHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYSBQYWdlXG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHBhcmFtIHBhZ2VJZCBQYWdlIGlkXG4gICAqIEBwYXJhbSByZXF1ZXN0Qm9keVxuICAgKiBAcmV0dXJucyBQYWdlIHRoZSB1cGRhdGVkIFBhZ2VcbiAgICogQHJldHVybnMgVGlueVN0YWNrc0Vycm9yIFRoZSBzcGVjaWZpZWQgcmVzb3VyY2Ugd2FzIG5vdCBmb3VuZFxuICAgKiBAdGhyb3dzIEFwaUVycm9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVwZGF0ZVBhZ2UoXG4gICAgY29uc29sZU5hbWU6IHN0cmluZyxcbiAgICBwYWdlSWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0Qm9keTogUGFnZSxcbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8UGFnZSB8IFRpbnlTdGFja3NFcnJvcj4ge1xuICAgIHJldHVybiBfX3JlcXVlc3QoT3BlbkFQSSwge1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jb25zb2xlcy97Y29uc29sZU5hbWV9L3BhZ2VzL3twYWdlSWR9JyxcbiAgICAgIHBhdGg6IHtcbiAgICAgICAgJ2NvbnNvbGVOYW1lJzogY29uc29sZU5hbWUsXG4gICAgICAgICdwYWdlSWQnOiBwYWdlSWQsXG4gICAgICB9LFxuICAgICAgYm9keTogcmVxdWVzdEJvZHksXG4gICAgICBtZWRpYVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGEgUGFnZVxuICAgKiBAcGFyYW0gY29uc29sZU5hbWUgQ29uc29sZSBuYW1lXG4gICAqIEBwYXJhbSBwYWdlSWQgUGFnZSBpZFxuICAgKiBAcmV0dXJucyBQYWdlIHRoZSBkZWxldGVkIFBhZ2VcbiAgICogQHJldHVybnMgVGlueVN0YWNrc0Vycm9yIFRoZSBzcGVjaWZpZWQgcmVzb3VyY2Ugd2FzIG5vdCBmb3VuZFxuICAgKiBAdGhyb3dzIEFwaUVycm9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGRlbGV0ZVBhZ2UoXG4gICAgY29uc29sZU5hbWU6IHN0cmluZyxcbiAgICBwYWdlSWQ6IHN0cmluZyxcbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8UGFnZSB8IFRpbnlTdGFja3NFcnJvcj4ge1xuICAgIHJldHVybiBfX3JlcXVlc3QoT3BlbkFQSSwge1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9jb25zb2xlcy97Y29uc29sZU5hbWV9L3BhZ2VzL3twYWdlSWR9JyxcbiAgICAgIHBhdGg6IHtcbiAgICAgICAgJ2NvbnNvbGVOYW1lJzogY29uc29sZU5hbWUsXG4gICAgICAgICdwYWdlSWQnOiBwYWdlSWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==