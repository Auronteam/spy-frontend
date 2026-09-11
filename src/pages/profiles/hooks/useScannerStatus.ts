import { useQueries } from '@tanstack/react-query';
import { fetchScannerStatus } from '@/api/scanner';
import type { ScannerStatus } from '@/api/scanner';
import type { Profile } from '@/pages/profiles/types';

const SCANNER_POLL_INTERVAL_MS = 15000;

// One query per profile via useQueries — same pattern as useVisionReady.
// Every profile is queried regardless of who started its scanner (or
// whether it was already running before this page loaded), and polling
// self-stops once running:false comes back (function-form refetchInterval).
export const useScannerStatus = (profiles: Profile[]) => {
    const queries = useQueries({
        queries: profiles.map(profile => ({
            queryKey: ['scanner', 'status', profile.id],
            queryFn: () => fetchScannerStatus(profile.id),
            refetchInterval: (query: { state: { data?: ScannerStatus } }) =>
                query.state.data?.running ? SCANNER_POLL_INTERVAL_MS : false,
        })),
    });

    const dataFor = (profileId: string): ScannerStatus | undefined => {
        const index = profiles.findIndex(p => p.id === profileId);
        return index !== -1 ? queries[index]?.data : undefined;
    };

    const isScannerRunning = (profileId: string) => !!dataFor(profileId)?.running;

    const isScannerPaused = (profileId: string) => !!dataFor(profileId)?.paused;

    const pauseMsLeft = (profileId: string) => {
        const t = dataFor(profileId)?.pausedUntil ?? null;
        if (!t) return 0;
        return Math.max(0, t - Date.now());
    };

    return {
        isScannerRunning,
        isScannerPaused,
        pauseMsLeft,
    };
};
