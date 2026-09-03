import { apiFetch } from '@/lib/api-fetch';
import type { LogFile } from '@/pages/logs/types';

export async function fetchProfileLogFiles(profileId: string): Promise<{ files: LogFile[] }> {
    return apiFetch(`/api/logs?profileId=${encodeURIComponent(profileId)}`);
}
