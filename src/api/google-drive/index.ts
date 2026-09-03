import { apiFetch } from '@/lib/api-fetch';

export async function fetchDriveFolder(folderId: string): Promise<unknown[]> {
    return apiFetch<unknown[]>(`/api/google/drive/folder/${encodeURIComponent(folderId)}`);
}
