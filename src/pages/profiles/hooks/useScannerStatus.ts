import { useQueries, useQueryClient } from '@tanstack/react-query';
import { fetchScannerStatus } from '@/api/scanner';
import type { ScannerStatus } from '@/api/scanner';
import type { Profile } from '@/types/profile';
import { queryKeys } from '@/lib/query-keys';

const SCANNER_POLL_INTERVAL_MS = 15000;
const SCANNER_IDLE_POLL_INTERVAL_MS = 30000;

// One query per profile via useQueries — same pattern as useVisionReady.
// Every profile is queried regardless of who started its scanner (or
// whether it was already running before this page loaded). Running scanners
// poll faster than stopped ones (function-form refetchInterval).
export const useScannerStatus = (profiles: Profile[]) => {
    const queryClient = useQueryClient();
    const queries = useQueries({
        queries: profiles.map(profile => ({
            queryKey: queryKeys.scanner.status(profile.id),
            queryFn: () => fetchScannerStatus(profile.id),
            refetchInterval: (query: { state: { data?: ScannerStatus } }) =>
                query.state.data?.running
                    ? SCANNER_POLL_INTERVAL_MS
                    : SCANNER_IDLE_POLL_INTERVAL_MS,
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

    const refreshScannerStatuses = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.scanner.all() });

    return {
        isScannerRunning,
        isScannerPaused,
        pauseMsLeft,
        refreshScannerStatuses,
    };
};
