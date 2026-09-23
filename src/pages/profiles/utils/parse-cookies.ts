import type { VisionCookie } from '@/pages/profiles/types';

// `expires` is a Unix timestamp (seconds), not a duration — default a cookie
// missing it to one year from now, matching a long-lived session cookie.
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
function defaultExpires(): number {
    return Math.floor(Date.now() / 1000) + ONE_YEAR_SECONDS;
}

export function parseCookiesJson(raw: string): VisionCookie[] {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    let parsed: unknown;
    try {
        parsed = JSON.parse(trimmed);
    } catch {
        throw new Error('Cookies must be valid JSON (an array of cookie objects)');
    }

    if (!Array.isArray(parsed)) {
        throw new Error('Cookies JSON must be an array');
    }

    return parsed
        .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
        .map(c => ({
            name: String(c.name ?? ''),
            value: String(c.value ?? ''),
            path: typeof c.path === 'string' && c.path ? c.path : '/',
            domain: String(c.domain ?? ''),
            expires: typeof c.expires === 'number' ? c.expires : defaultExpires(),
        }))
        .filter(c => c.name && c.domain);
}
