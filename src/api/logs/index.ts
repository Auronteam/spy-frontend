import { apiFetch, apiFetchText } from '@/lib/api-fetch';
import type { LogFile } from '@/pages/logs/types';

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
