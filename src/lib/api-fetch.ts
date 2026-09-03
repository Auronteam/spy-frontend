import { BACKEND_BASE } from '@/config';
import { authHeaders } from '@/lib/client-auth';
import { ApiError } from '@/lib/errors/api-error';
import { captureError } from '@/lib/errors/sentry';

type BackendErrorBody = {
    error?: string | { code?: string; message?: string; details?: unknown };
};

export async function parseErrorBody(
    res: Response
): Promise<{ message: string; code?: string; details?: unknown }> {
    let body: BackendErrorBody | null = null;
    try {
        body = await res.json();
    } catch {
        body = null;
    }

    const err = body?.error;
    if (typeof err === 'string') return { message: err };
    if (err && typeof err === 'object') {
        return { message: err.message ?? res.statusText, code: err.code, details: err.details };
    }
    return { message: res.statusText || 'Request failed' };
}

// Exported separately — used here on 401, and by AuthContext.logout() for an
// explicit user-initiated logout.
export function forceLogout(): void {
    if (typeof document !== 'undefined') {
        document.cookie = 'token=; Max-Age=0; path=/';
    }
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}

export type ApiFetchOptions = {
    // Public/unauthenticated calls (e.g. login) legitimately return 401 for bad
    // credentials — that must not trigger the session-expiry logout+redirect.
    skipAuthRedirect?: boolean;
    // Expected statuses for this specific call that shouldn't be reported to
    // Sentry (e.g. a 404 from an "does this exist" check) — not a bug, just noise.
    silentErrorStatuses?: number[];
};

// headers narrowed to Record<string, string> — the whole app only ever passes
// headers as a plain object (never Headers/string[][]), so authHeaders() can
// safely spread it without a type cast.
export type ApiFetchInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };

// Never reported to Sentry — expected states (expired session, no permission,
// form validation error, service temporarily unavailable), not backend bugs.
const SENTRY_EXCLUDED_STATUSES = new Set([401, 403, 422, 503]);

function reportApiError(error: ApiError, path: string, options?: ApiFetchOptions): void {
    const status = error.status;
    if (status !== undefined && SENTRY_EXCLUDED_STATUSES.has(status)) return;
    if (status !== undefined && (options?.silentErrorStatuses ?? []).includes(status)) return;
    captureError(error, { path, status: error.status, code: error.code });
}

const REQUEST_TIMEOUT_MS = 30_000;

// Shared by apiFetch/apiFetchText/apiFetchRaw: makes the request, attaches auth
// headers, and handles 401/errors — reading the success body is left to the caller.
async function apiRequest(
    path: string,
    init?: ApiFetchInit,
    options?: ApiFetchOptions
): Promise<Response> {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);
    const signal = init?.signal
        ? AbortSignal.any([init.signal, timeoutController.signal])
        : timeoutController.signal;

    let res: Response;
    try {
        res = await fetch(`${BACKEND_BASE}${path}`, {
            ...init,
            headers: authHeaders(init?.headers),
            signal,
        });
    } catch {
        const error = new ApiError(
            timeoutController.signal.aborted ? 'Request timed out' : 'Could not reach the server'
        );
        reportApiError(error, path, options);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }

    if (!res.ok) {
        const { message, code, details } = await parseErrorBody(res);
        if (res.status === 401 && !options?.skipAuthRedirect) {
            forceLogout();
            // Navigation is async — never resolve so callers can't render a
            // stale error before the redirect actually happens.
            return new Promise<Response>(() => {});
        }
        const error = new ApiError(message, res.status, code, details);
        reportApiError(error, path, options);
        throw error;
    }

    return res;
}

// Central point for every JSON request to the backend. `path` includes the
// /api prefix, as in every src/api/* call (e.g. apiFetch('/api/posts?page=1')).
export async function apiFetch<T>(
    path: string,
    init?: ApiFetchInit,
    options?: ApiFetchOptions
): Promise<T> {
    const res = await apiRequest(path, init, options);
    if (res.status === 204) return undefined as T;
    return res.json();
}

// Same as apiFetch, for text/plain endpoints (e.g. logs) — the body is read as text.
export async function apiFetchText(
    path: string,
    init?: ApiFetchInit,
    options?: ApiFetchOptions
): Promise<string> {
    const res = await apiRequest(path, init, options);
    return res.text();
}

// For callers that need the raw Response (e.g. a blob download that reads
// Content-Disposition) — the caller reads the body itself.
export async function apiFetchRaw(
    path: string,
    init?: ApiFetchInit,
    options?: ApiFetchOptions
): Promise<Response> {
    return apiRequest(path, init, options);
}
