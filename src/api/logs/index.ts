import { BACKEND_BASE } from '@/config';
import { apiFetch, apiFetchText } from '@/lib/api-fetch';
import type { LogFile } from '@/api/logs/types';

export async function fetchProfileLogFiles(profileId: string): Promise<{ files: LogFile[] }> {
    return apiFetch(`/api/logs?profileId=${encodeURIComponent(profileId)}`);
}

export async function fetchProfileLogContent(
    fileName: string,
    params: { lines: string; tail: boolean },
    signal: AbortSignal
): Promise<string> {
    const query = new URLSearchParams({ lines: params.lines, tail: String(params.tail) });
    return apiFetchText(`/api/logs/${fileName}?${query}`, { signal });
}

export function getLogStreamUrl(profileId: string): string {
    return `${BACKEND_BASE}/api/logs/stream?profileId=${encodeURIComponent(profileId)}`;
}
