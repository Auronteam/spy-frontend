import { apiFetch } from '@/lib/api-fetch';
import type { Profile } from '@/pages/profiles/types';

type StopVisionResponse = {
    ok: boolean;
    message?: string;
};

type ActiveProfilesResponse =
    | Array<{ profile_id?: string }>
    | {
          profiles?: Array<{ profile_id?: string }>;
          activeProfiles?: Array<{ profile_id?: string }>;
      };

export async function fetchVisionFolders(): Promise<Array<{ id: string; name?: string }>> {
    return apiFetch('/api/vision/folders');
}

export async function fetchVisionProfiles(folderId: string): Promise<Profile[]> {
    return apiFetch(`/api/vision/folders/${encodeURIComponent(folderId)}/profiles`);
}

export async function runVisionProfile(profileId: string, folderId?: string) {
    return apiFetch<{ ok: true; profileId: string; folderId: string; startedAt: string }>(
        '/api/vision/run',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId, folderId }),
        }
    );
}

export async function fetchActiveVisionProfiles(): Promise<ActiveProfilesResponse> {
    return apiFetch('/api/vision/active-profiles');
}

export async function fetchVisionReady(
    profileId: string
): Promise<{ ready: boolean; reason?: string }> {
    return apiFetch(`/api/vision/ready?profileId=${encodeURIComponent(profileId)}`);
}

export async function stopVisionProfileOnServer(
    profileId: string,
    folderId: string
): Promise<StopVisionResponse> {
    return apiFetch<StopVisionResponse>('/api/vision/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, folderId }),
    });
}
