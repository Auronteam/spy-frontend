import { apiFetch } from '@/lib/api-fetch';

type RunScannerResponse = { ok: true; scannerId: string };

type StopScannerResponse = { ok: true; message: string };

export async function runScanner(
    profileId: string,
    folderId?: string
): Promise<RunScannerResponse> {
    return apiFetch<RunScannerResponse>('/api/scanner/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, folderId }),
    });
}

export async function stopScanner(profileId: string): Promise<StopScannerResponse> {
    return apiFetch<StopScannerResponse>('/api/scanner/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId }),
    });
}

export type ScannerStatus = { running: boolean; paused?: boolean; pausedUntil?: number | null };

export async function fetchScannerStatus(profileId: string): Promise<ScannerStatus> {
    const json = await apiFetch<{
        running?: boolean;
        paused?: boolean;
        pausedUntil?: number | null;
    }>(`/api/scanner/status?profileId=${encodeURIComponent(profileId)}`);

    return {
        running: !!json?.running,
        paused: !!json?.paused,
        pausedUntil: json?.pausedUntil ?? null,
    };
}
