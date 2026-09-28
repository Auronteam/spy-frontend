import type { QueryClient } from '@tanstack/react-query';
import { fetchScannerStatus, stopScanner, type ScannerStatus } from '@/api/scanner';
import { queryKeys } from '@/lib/query-keys';

const CONFIRM_MAX_ATTEMPTS = 20;
const CONFIRM_INTERVAL_MS = 1500;

export class ScannerStopTimeoutError extends Error {
    constructor() {
        super('Scanner is still finishing its current step. Try again in a minute.');
        this.name = 'ScannerStopTimeoutError';
    }
}

export function fetchFreshScannerStatus(
    queryClient: QueryClient,
    profileId: string
): Promise<ScannerStatus> {
    return queryClient.fetchQuery({
        queryKey: queryKeys.scanner.status(profileId),
        queryFn: () => fetchScannerStatus(profileId),
        staleTime: 0,
    });
}

// POST /scanner/stop responds success immediately, but the actual cleanup
// (the background orchestrator flipping isScannerRunning to false) happens
// asynchronously, after the in-flight step — which can include OCR/landing
// capture/Drive upload, seconds to tens of seconds — actually finishes. So
// this polls the real status until running:false instead of guessing a
// timeout. Uses queryClient.fetchQuery so the same ['scanner','status',id]
// cache that useScannerStatus reads updates live during the wait, instead of
// only once at the end.
async function waitForScannerStopped(queryClient: QueryClient, profileId: string): Promise<void> {
    for (let attempt = 0; attempt < CONFIRM_MAX_ATTEMPTS; attempt++) {
        try {
            const status = await fetchFreshScannerStatus(queryClient, profileId);
            if (!status.running) return;
        } catch {
            // transient error — retry
        }
        await new Promise(resolve => setTimeout(resolve, CONFIRM_INTERVAL_MS));
    }
    throw new ScannerStopTimeoutError();
}

export async function stopScannerAndWait(
    queryClient: QueryClient,
    profileId: string
): Promise<void> {
    await stopScanner(profileId);
    await waitForScannerStopped(queryClient, profileId);
}
