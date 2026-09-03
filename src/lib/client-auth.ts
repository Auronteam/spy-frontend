const TOKEN_COOKIE_NAME = 'token';
const TOKEN_MAX_AGE_SECONDS = 86400;

export function getClientAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

// httpOnly is intentionally never set — the backend is a separate origin, and
// client code (scanner buttons, live logs, creative previews) needs to read
// this cookie itself to attach it as Authorization/?token= on direct requests.
export function setClientAuthToken(token: string): void {
    const secure = location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; samesite=strict${secure}`;
}

export function clearClientAuthToken(): void {
    document.cookie = `${TOKEN_COOKIE_NAME}=; Max-Age=0; path=/`;
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
