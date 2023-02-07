export type TinyStacksError = {
    name?: string;
    message?: string;
    status?: number;
    stack?: string;
    type?: TinyStacksError.type;
};
export declare namespace TinyStacksError {
    enum type {
        UNAUTHORIZED = "Unauthorized",
        UNAUTHENTICATED = "Unauthenticated",
        VALIDATION = "Validation",
        NOT_FOUND = "NotFound",
        CONFLICT = "Conflict",
        INTERNAL_SERVER_ERROR = "InternalServerError"
    }
}
