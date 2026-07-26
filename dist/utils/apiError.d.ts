export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly errors: unknown[];
    readonly success: false;
    constructor(statusCode: number, message?: string, errors?: unknown[]);
}
//# sourceMappingURL=apiError.d.ts.map