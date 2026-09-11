import type { QueryClient } from '@tanstack/react-query';
import { fetchScannerStatus, stopScanner } from '@/api/scanner';

const CONFIRM_MAX_ATTEMPTS = 20;
const CONFIRM_INTERVAL_MS = 1500;

// POST /scanner/stop responds success immediately, but the actual cleanup
// (the background orchestrator flipping isScannerRunning to false) happens
// asynchronously, after the in-flight step — which can include OCR/landing
// capture/Drive upload, seconds to tens of seconds — actually finishes. So
// this polls the real status until running:false instead of guessing a
// timeout. Uses queryClient.fetchQuery so the same ['scanner','status',id]
// cache that useScannerStatus reads updates live during the wait, instead of
// only once at the end.
export async function waitForScannerStopped(
    queryClient: QueryClient,
    profileId: string
): Promise<void> {
    const queryKey = ['scanner', 'status', profileId];

    for (let attempt = 0; attempt < CONFIRM_MAX_ATTEMPTS; attempt++) {
        try {
            const status = await queryClient.fetchQuery({
                queryKey,
                queryFn: () => fetchScannerStatus(profileId),
            });
            if (!status.running) return;
        } catch {
            // transient error — retry
        }
        await new Promise(resolve => setTimeout(resolve, CONFIRM_INTERVAL_MS));
    }
}

export async function stopScannerAndWait(
    queryClient: QueryClient,
    profileId: string
): Promise<void> {
    await stopScanner(profileId);
    await waitForScannerStopped(queryClient, profileId);
}
