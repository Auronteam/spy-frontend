export class ApiError extends Error {
    // Duplicates instanceof in case the ApiError class ends up duplicated across
    // bundle chunks (instanceof across different module copies of the class can
    // then unexpectedly return false; this marker is still recognized structurally).
    readonly __apiError = true as const;
    readonly status?: number;
    readonly code?: string;
    readonly details?: unknown;

    constructor(message: string, status?: number, code?: string, details?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return (
        error instanceof ApiError ||
        (typeof error === 'object' &&
            error !== null &&
            '__apiError' in error &&
            error.__apiError === true)
    );
}
