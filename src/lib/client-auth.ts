export function getClientAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const token = getClientAuthToken();
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

// For requests that can't set headers themselves (<img src>, <a href>,
// EventSource) — the backend also accepts the token as a ?token= query param.
export function withAuthToken(url: string): string {
    const token = getClientAuthToken();
    if (!token) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${encodeURIComponent(token)}`;
}
