"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHealthService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ServiceHealthService {
    /**
     * @returns Ping Returns the string Healthy Connection in an HTTP 200 response
     * @throws ApiError
     */
    static getPing() {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/ping',
        });
    }
}
exports.ServiceHealthService = ServiceHealthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUhlYWx0aFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9nZW4vc2VydmljZXMvU2VydmljZUhlYWx0aFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsNkNBQTBDO0FBQzFDLDZDQUF1RDtBQUV2RCxNQUFhLG9CQUFvQjtJQUUvQjs7O09BR0c7SUFDSSxNQUFNLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUEsaUJBQVMsRUFBQyxpQkFBTyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLE9BQU87U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0NBRUY7QUFiRCxvREFhQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgKi9cbmltcG9ydCB0eXBlIHsgUGluZyB9IGZyb20gJy4uL21vZGVscy9QaW5nJztcblxuaW1wb3J0IHR5cGUgeyBDYW5jZWxhYmxlUHJvbWlzZSB9IGZyb20gJy4uL2NvcmUvQ2FuY2VsYWJsZVByb21pc2UnO1xuaW1wb3J0IHsgT3BlbkFQSSB9IGZyb20gJy4uL2NvcmUvT3BlbkFQSSc7XG5pbXBvcnQgeyByZXF1ZXN0IGFzIF9fcmVxdWVzdCB9IGZyb20gJy4uL2NvcmUvcmVxdWVzdCc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlSGVhbHRoU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIFBpbmcgUmV0dXJucyB0aGUgc3RyaW5nIEhlYWx0aHkgQ29ubmVjdGlvbiBpbiBhbiBIVFRQIDIwMCByZXNwb25zZVxuICAgKiBAdGhyb3dzIEFwaUVycm9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldFBpbmcoKTogQ2FuY2VsYWJsZVByb21pc2U8UGluZz4ge1xuICAgIHJldHVybiBfX3JlcXVlc3QoT3BlbkFQSSwge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9waW5nJyxcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=