"use strict";
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinyStacksError = void 0;
var TinyStacksError;
(function (TinyStacksError) {
    let type;
    (function (type) {
        type["UNAUTHORIZED"] = "Unauthorized";
        type["UNAUTHENTICATED"] = "Unauthenticated";
        type["VALIDATION"] = "Validation";
        type["NOT_FOUND"] = "NotFound";
        type["CONFLICT"] = "Conflict";
        type["INTERNAL_SERVER_ERROR"] = "InternalServerError";
    })(type = TinyStacksError.type || (TinyStacksError.type = {}));
})(TinyStacksError = exports.TinyStacksError || (exports.TinyStacksError = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlueVN0YWNrc0Vycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZ2VuL21vZGVscy9UaW55U3RhY2tzRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQjtBQUMxQixvQkFBb0I7QUFDcEIsb0JBQW9COzs7QUFVcEIsSUFBaUIsZUFBZSxDQVkvQjtBQVpELFdBQWlCLGVBQWU7SUFFOUIsSUFBWSxJQU9YO0lBUEQsV0FBWSxJQUFJO1FBQ2QscUNBQTZCLENBQUE7UUFDN0IsMkNBQW1DLENBQUE7UUFDbkMsaUNBQXlCLENBQUE7UUFDekIsOEJBQXNCLENBQUE7UUFDdEIsNkJBQXFCLENBQUE7UUFDckIscURBQTZDLENBQUE7SUFDL0MsQ0FBQyxFQVBXLElBQUksR0FBSixvQkFBSSxLQUFKLG9CQUFJLFFBT2Y7QUFHSCxDQUFDLEVBWmdCLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBWS9CIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cbi8qIHRzbGludDpkaXNhYmxlICovXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5leHBvcnQgdHlwZSBUaW55U3RhY2tzRXJyb3IgPSB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIHN0YXR1cz86IG51bWJlcjtcbiAgc3RhY2s/OiBzdHJpbmc7XG4gIHR5cGU/OiBUaW55U3RhY2tzRXJyb3IudHlwZTtcbn07XG5cbmV4cG9ydCBuYW1lc3BhY2UgVGlueVN0YWNrc0Vycm9yIHtcblxuICBleHBvcnQgZW51bSB0eXBlIHtcbiAgICBVTkFVVEhPUklaRUQgPSAnVW5hdXRob3JpemVkJyxcbiAgICBVTkFVVEhFTlRJQ0FURUQgPSAnVW5hdXRoZW50aWNhdGVkJyxcbiAgICBWQUxJREFUSU9OID0gJ1ZhbGlkYXRpb24nLFxuICAgIE5PVF9GT1VORCA9ICdOb3RGb3VuZCcsXG4gICAgQ09ORkxJQ1QgPSAnQ29uZmxpY3QnLFxuICAgIElOVEVSTkFMX1NFUlZFUl9FUlJPUiA9ICdJbnRlcm5hbFNlcnZlckVycm9yJyxcbiAgfVxuXG5cbn1cblxuIl19