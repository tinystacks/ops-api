"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class WidgetService {
    /**
     * Creates a Widget
     * @param consoleName Console name
     * @param requestBody
     * @returns Widget the new Widget
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static createWidget(consoleName, requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/consoles/{consoleName}/widgets',
            path: {
                'consoleName': consoleName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Fetches the details for the specified Widget.
     * @param consoleName Console name
     * @param widgetId Widget id
     * @returns Widget A fully hydrated Widget.
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static getWidget(consoleName, widgetId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/consoles/{consoleName}/widgets/{widgetId}',
            path: {
                'consoleName': consoleName,
                'widgetId': widgetId,
            },
        });
    }
    /**
     * Updates a Widget
     * @param consoleName Console name
     * @param widgetId Widget id
     * @param requestBody
     * @returns Widget the updated Widget
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static updateWidget(consoleName, widgetId, requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/consoles/{consoleName}/widgets/{widgetId}',
            path: {
                'consoleName': consoleName,
                'widgetId': widgetId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Deletes a Widget
     * @param consoleName Console name
     * @param widgetId Widget id
     * @returns Widget the deleted Widget
     * @returns TinyStacksError The specified resource was not found
     * @throws ApiError
     */
    static deleteWidget(consoleName, widgetId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/consoles/{consoleName}/widgets/{widgetId}',
            path: {
                'consoleName': consoleName,
                'widgetId': widgetId,
            },
        });
    }
}
exports.WidgetService = WidgetService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2lkZ2V0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2dlbi9zZXJ2aWNlcy9XaWRnZXRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU9BLDZDQUEwQztBQUMxQyw2Q0FBdUQ7QUFFdkQsTUFBYSxhQUFhO0lBRXhCOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUN4QixXQUFtQixFQUNuQixXQUFtQjtRQUVuQixPQUFPLElBQUEsaUJBQVMsRUFBQyxpQkFBTyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsR0FBRyxFQUFFLGlDQUFpQztZQUN0QyxJQUFJLEVBQUU7Z0JBQ0osYUFBYSxFQUFFLFdBQVc7YUFDM0I7WUFDRCxJQUFJLEVBQUUsV0FBVztZQUNqQixTQUFTLEVBQUUsa0JBQWtCO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FDckIsV0FBbUIsRUFDbkIsUUFBZ0I7UUFFaEIsT0FBTyxJQUFBLGlCQUFTLEVBQUMsaUJBQU8sRUFBRTtZQUN4QixNQUFNLEVBQUUsS0FBSztZQUNiLEdBQUcsRUFBRSw0Q0FBNEM7WUFDakQsSUFBSSxFQUFFO2dCQUNKLGFBQWEsRUFBRSxXQUFXO2dCQUMxQixVQUFVLEVBQUUsUUFBUTthQUNyQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQ3hCLFdBQW1CLEVBQ25CLFFBQWdCLEVBQ2hCLFdBQW1CO1FBRW5CLE9BQU8sSUFBQSxpQkFBUyxFQUFDLGlCQUFPLEVBQUU7WUFDeEIsTUFBTSxFQUFFLEtBQUs7WUFDYixHQUFHLEVBQUUsNENBQTRDO1lBQ2pELElBQUksRUFBRTtnQkFDSixhQUFhLEVBQUUsV0FBVztnQkFDMUIsVUFBVSxFQUFFLFFBQVE7YUFDckI7WUFDRCxJQUFJLEVBQUUsV0FBVztZQUNqQixTQUFTLEVBQUUsa0JBQWtCO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FDeEIsV0FBbUIsRUFDbkIsUUFBZ0I7UUFFaEIsT0FBTyxJQUFBLGlCQUFTLEVBQUMsaUJBQU8sRUFBRTtZQUN4QixNQUFNLEVBQUUsUUFBUTtZQUNoQixHQUFHLEVBQUUsNENBQTRDO1lBQ2pELElBQUksRUFBRTtnQkFDSixhQUFhLEVBQUUsV0FBVztnQkFDMUIsVUFBVSxFQUFFLFFBQVE7YUFDckI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBRUY7QUEvRkQsc0NBK0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cbi8qIHRzbGludDpkaXNhYmxlICovXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuaW1wb3J0IHR5cGUgeyBUaW55U3RhY2tzRXJyb3IgfSBmcm9tICcuLi9tb2RlbHMvVGlueVN0YWNrc0Vycm9yJztcbmltcG9ydCB0eXBlIHsgV2lkZ2V0IH0gZnJvbSAnLi4vbW9kZWxzL1dpZGdldCc7XG5cbmltcG9ydCB0eXBlIHsgQ2FuY2VsYWJsZVByb21pc2UgfSBmcm9tICcuLi9jb3JlL0NhbmNlbGFibGVQcm9taXNlJztcbmltcG9ydCB7IE9wZW5BUEkgfSBmcm9tICcuLi9jb3JlL09wZW5BUEknO1xuaW1wb3J0IHsgcmVxdWVzdCBhcyBfX3JlcXVlc3QgfSBmcm9tICcuLi9jb3JlL3JlcXVlc3QnO1xuXG5leHBvcnQgY2xhc3MgV2lkZ2V0U2VydmljZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBXaWRnZXRcbiAgICogQHBhcmFtIGNvbnNvbGVOYW1lIENvbnNvbGUgbmFtZVxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHlcbiAgICogQHJldHVybnMgV2lkZ2V0IHRoZSBuZXcgV2lkZ2V0XG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcmVhdGVXaWRnZXQoXG4gICAgY29uc29sZU5hbWU6IHN0cmluZyxcbiAgICByZXF1ZXN0Qm9keTogV2lkZ2V0LFxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxXaWRnZXQgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NvbnNvbGVzL3tjb25zb2xlTmFtZX0vd2lkZ2V0cycsXG4gICAgICBwYXRoOiB7XG4gICAgICAgICdjb25zb2xlTmFtZSc6IGNvbnNvbGVOYW1lLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IHJlcXVlc3RCb2R5LFxuICAgICAgbWVkaWFUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgZGV0YWlscyBmb3IgdGhlIHNwZWNpZmllZCBXaWRnZXQuXG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHBhcmFtIHdpZGdldElkIFdpZGdldCBpZFxuICAgKiBAcmV0dXJucyBXaWRnZXQgQSBmdWxseSBoeWRyYXRlZCBXaWRnZXQuXG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRXaWRnZXQoXG4gICAgY29uc29sZU5hbWU6IHN0cmluZyxcbiAgICB3aWRnZXRJZDogc3RyaW5nLFxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxBcnJheTxXaWRnZXQ+IHwgVGlueVN0YWNrc0Vycm9yPiB7XG4gICAgcmV0dXJuIF9fcmVxdWVzdChPcGVuQVBJLCB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NvbnNvbGVzL3tjb25zb2xlTmFtZX0vd2lkZ2V0cy97d2lkZ2V0SWR9JyxcbiAgICAgIHBhdGg6IHtcbiAgICAgICAgJ2NvbnNvbGVOYW1lJzogY29uc29sZU5hbWUsXG4gICAgICAgICd3aWRnZXRJZCc6IHdpZGdldElkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGEgV2lkZ2V0XG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHBhcmFtIHdpZGdldElkIFdpZGdldCBpZFxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHlcbiAgICogQHJldHVybnMgV2lkZ2V0IHRoZSB1cGRhdGVkIFdpZGdldFxuICAgKiBAcmV0dXJucyBUaW55U3RhY2tzRXJyb3IgVGhlIHNwZWNpZmllZCByZXNvdXJjZSB3YXMgbm90IGZvdW5kXG4gICAqIEB0aHJvd3MgQXBpRXJyb3JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdXBkYXRlV2lkZ2V0KFxuICAgIGNvbnNvbGVOYW1lOiBzdHJpbmcsXG4gICAgd2lkZ2V0SWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0Qm9keTogV2lkZ2V0LFxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxXaWRnZXQgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmw6ICcvY29uc29sZXMve2NvbnNvbGVOYW1lfS93aWRnZXRzL3t3aWRnZXRJZH0nLFxuICAgICAgcGF0aDoge1xuICAgICAgICAnY29uc29sZU5hbWUnOiBjb25zb2xlTmFtZSxcbiAgICAgICAgJ3dpZGdldElkJzogd2lkZ2V0SWQsXG4gICAgICB9LFxuICAgICAgYm9keTogcmVxdWVzdEJvZHksXG4gICAgICBtZWRpYVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGEgV2lkZ2V0XG4gICAqIEBwYXJhbSBjb25zb2xlTmFtZSBDb25zb2xlIG5hbWVcbiAgICogQHBhcmFtIHdpZGdldElkIFdpZGdldCBpZFxuICAgKiBAcmV0dXJucyBXaWRnZXQgdGhlIGRlbGV0ZWQgV2lkZ2V0XG4gICAqIEByZXR1cm5zIFRpbnlTdGFja3NFcnJvciBUaGUgc3BlY2lmaWVkIHJlc291cmNlIHdhcyBub3QgZm91bmRcbiAgICogQHRocm93cyBBcGlFcnJvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBkZWxldGVXaWRnZXQoXG4gICAgY29uc29sZU5hbWU6IHN0cmluZyxcbiAgICB3aWRnZXRJZDogc3RyaW5nLFxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxXaWRnZXQgfCBUaW55U3RhY2tzRXJyb3I+IHtcbiAgICByZXR1cm4gX19yZXF1ZXN0KE9wZW5BUEksIHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6ICcvY29uc29sZXMve2NvbnNvbGVOYW1lfS93aWRnZXRzL3t3aWRnZXRJZH0nLFxuICAgICAgcGF0aDoge1xuICAgICAgICAnY29uc29sZU5hbWUnOiBjb25zb2xlTmFtZSxcbiAgICAgICAgJ3dpZGdldElkJzogd2lkZ2V0SWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==