"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelablePromise = exports.CancelError = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
class CancelError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CancelError';
    }
    get isCancelled() {
        return true;
    }
}
exports.CancelError = CancelError;
class CancelablePromise {
    [Symbol.toStringTag];
    _isResolved;
    _isRejected;
    _isCancelled;
    _cancelHandlers;
    _promise;
    _resolve;
    _reject;
    constructor(executor) {
        this._isResolved = false;
        this._isRejected = false;
        this._isCancelled = false;
        this._cancelHandlers = [];
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            const onResolve = (value) => {
                if (this._isResolved || this._isRejected || this._isCancelled) {
                    return;
                }
                this._isResolved = true;
                this._resolve?.(value);
            };
            const onReject = (reason) => {
                if (this._isResolved || this._isRejected || this._isCancelled) {
                    return;
                }
                this._isRejected = true;
                this._reject?.(reason);
            };
            const onCancel = (cancelHandler) => {
                if (this._isResolved || this._isRejected || this._isCancelled) {
                    return;
                }
                this._cancelHandlers.push(cancelHandler);
            };
            Object.defineProperty(onCancel, 'isResolved', {
                get: () => this._isResolved,
            });
            Object.defineProperty(onCancel, 'isRejected', {
                get: () => this._isRejected,
            });
            Object.defineProperty(onCancel, 'isCancelled', {
                get: () => this._isCancelled,
            });
            return executor(onResolve, onReject, onCancel);
        });
    }
    then(onFulfilled, onRejected) {
        return this._promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        return this._promise.catch(onRejected);
    }
    finally(onFinally) {
        return this._promise.finally(onFinally);
    }
    cancel() {
        if (this._isResolved || this._isRejected || this._isCancelled) {
            return;
        }
        this._isCancelled = true;
        if (this._cancelHandlers.length) {
            try {
                for (const cancelHandler of this._cancelHandlers) {
                    cancelHandler();
                }
            }
            catch (error) {
                console.warn('Cancellation threw an error', error);
                return;
            }
        }
        this._cancelHandlers.length = 0;
        this._reject?.(new CancelError('Request aborted'));
    }
    get isCancelled() {
        return this._isCancelled;
    }
}
exports.CancelablePromise = CancelablePromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FuY2VsYWJsZVByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9nZW4vY29yZS9DYW5jZWxhYmxlUHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQixNQUFhLFdBQVksU0FBUSxLQUFLO0lBRXBDLFlBQVksT0FBZTtRQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBVkQsa0NBVUM7QUFVRCxNQUFhLGlCQUFpQjtJQUNuQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBVTtJQUUvQixXQUFXLENBQVU7SUFDckIsV0FBVyxDQUFVO0lBQ3JCLFlBQVksQ0FBVTtJQUNiLGVBQWUsQ0FBaUI7SUFDaEMsUUFBUSxDQUFhO0lBQzlCLFFBQVEsQ0FBdUM7SUFDL0MsT0FBTyxDQUEwQjtJQUV6QyxZQUNFLFFBSVM7UUFFVCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ2pELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBRXRCLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBeUIsRUFBUSxFQUFFO2dCQUNwRCxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFB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LENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBeEdELDhDQXdHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgKi9cbmV4cG9ydCBjbGFzcyBDYW5jZWxFcnJvciBleHRlbmRzIEVycm9yIHtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSAnQ2FuY2VsRXJyb3InO1xuICB9XG5cbiAgcHVibGljIGdldCBpc0NhbmNlbGxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uQ2FuY2VsIHtcbiAgcmVhZG9ubHkgaXNSZXNvbHZlZDogYm9vbGVhbjtcbiAgcmVhZG9ubHkgaXNSZWplY3RlZDogYm9vbGVhbjtcbiAgcmVhZG9ubHkgaXNDYW5jZWxsZWQ6IGJvb2xlYW47XG5cbiAgKGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgQ2FuY2VsYWJsZVByb21pc2U8VD4gaW1wbGVtZW50cyBQcm9taXNlPFQ+IHtcbiAgcmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ10hOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfaXNSZXNvbHZlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaXNSZWplY3RlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaXNDYW5jZWxsZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbmNlbEhhbmRsZXJzOiAoKCkgPT4gdm9pZClbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcHJvbWlzZTogUHJvbWlzZTxUPjtcbiAgcHJpdmF0ZSBfcmVzb2x2ZT86ICh2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZWplY3Q/OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGV4ZWN1dG9yOiAoXG4gICAgICByZXNvbHZlOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZCxcbiAgICAgIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZCxcbiAgICAgIG9uQ2FuY2VsOiBPbkNhbmNlbFxuICAgICkgPT4gdm9pZFxuICApIHtcbiAgICB0aGlzLl9pc1Jlc29sdmVkID0gZmFsc2U7XG4gICAgdGhpcy5faXNSZWplY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5fY2FuY2VsSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLl9wcm9taXNlID0gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLl9yZWplY3QgPSByZWplY3Q7XG5cbiAgICAgIGNvbnN0IG9uUmVzb2x2ZSA9ICh2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9pc1Jlc29sdmVkIHx8IHRoaXMuX2lzUmVqZWN0ZWQgfHwgdGhpcy5faXNDYW5jZWxsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNSZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3Jlc29sdmU/Lih2YWx1ZSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvblJlamVjdCA9IChyZWFzb24/OiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUmVzb2x2ZWQgfHwgdGhpcy5faXNSZWplY3RlZCB8fCB0aGlzLl9pc0NhbmNlbGxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc1JlamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmVqZWN0Py4ocmVhc29uKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IG9uQ2FuY2VsID0gKGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUmVzb2x2ZWQgfHwgdGhpcy5faXNSZWplY3RlZCB8fCB0aGlzLl9pc0NhbmNlbGxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYW5jZWxIYW5kbGVycy5wdXNoKGNhbmNlbEhhbmRsZXIpO1xuICAgICAgfTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9uQ2FuY2VsLCAnaXNSZXNvbHZlZCcsIHtcbiAgICAgICAgZ2V0OiAoKTogYm9vbGVhbiA9PiB0aGlzLl9pc1Jlc29sdmVkLFxuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvbkNhbmNlbCwgJ2lzUmVqZWN0ZWQnLCB7XG4gICAgICAgIGdldDogKCk6IGJvb2xlYW4gPT4gdGhpcy5faXNSZWplY3RlZCxcbiAgICAgIH0pO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob25DYW5jZWwsICdpc0NhbmNlbGxlZCcsIHtcbiAgICAgICAgZ2V0OiAoKTogYm9vbGVhbiA9PiB0aGlzLl9pc0NhbmNlbGxlZCxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZXhlY3V0b3Iob25SZXNvbHZlLCBvblJlamVjdCwgb25DYW5jZWwgYXMgT25DYW5jZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRoZW48VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcbiAgICBvbkZ1bGZpbGxlZD86ICgodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KSB8IG51bGwsXG4gICAgb25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KSB8IG51bGxcbiAgKTogUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPiB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb21pc2UudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cblxuICBwdWJsaWMgY2F0Y2g8VFJlc3VsdCA9IG5ldmVyPihcbiAgICBvblJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdCB8IFByb21pc2VMaWtlPFRSZXN1bHQ+KSB8IG51bGxcbiAgKTogUHJvbWlzZTxUIHwgVFJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLl9wcm9taXNlLmNhdGNoKG9uUmVqZWN0ZWQpO1xuICB9XG5cbiAgcHVibGljIGZpbmFsbHkob25GaW5hbGx5PzogKCgpID0+IHZvaWQpIHwgbnVsbCk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiB0aGlzLl9wcm9taXNlLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5jZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzUmVzb2x2ZWQgfHwgdGhpcy5faXNSZWplY3RlZCB8fCB0aGlzLl9pc0NhbmNlbGxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuX2NhbmNlbEhhbmRsZXJzLmxlbmd0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChjb25zdCBjYW5jZWxIYW5kbGVyIG9mIHRoaXMuX2NhbmNlbEhhbmRsZXJzKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbmNlbGxhdGlvbiB0aHJldyBhbiBlcnJvcicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9jYW5jZWxIYW5kbGVycy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3JlamVjdD8uKG5ldyBDYW5jZWxFcnJvcignUmVxdWVzdCBhYm9ydGVkJykpO1xuICB9XG5cbiAgcHVibGljIGdldCBpc0NhbmNlbGxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNDYW5jZWxsZWQ7XG4gIH1cbn1cbiJdfQ==