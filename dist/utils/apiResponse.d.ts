export declare class ApiResponse<T> {
    readonly statusCode: number;
    readonly data: T;
    readonly message: string;
    readonly success: boolean;
    constructor(statusCode: number, data: T, message?: string);
}
//# sourceMappingURL=apiResponse.d.ts.map