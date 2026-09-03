import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchScannerStatus } from '@/api/scanner';
import type { ScannerStatus } from '@/api/scanner';
import type { Profile } from '@/pages/profiles/types';

export const useScannerStatus = (profiles: Profile[]) => {
    const [statusById, setStatusById] = useState<Record<string, ScannerStatus>>({});
    const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

    const initializeScannerStatuses = useCallback(async (profilesList: Profile[]) => {
        const statusMap: Record<string, ScannerStatus> = {};

        await Promise.all(
            profilesList.map(async (profile: Profile) => {
                try {
                    const status = await fetchScannerStatus(profile.id);
                    statusMap[profile.id] = status;
                } catch {
                    statusMap[profile.id] = { running: false };
                }
            })
        );

        setStatusById(statusMap);
    }, []);

    useEffect(() => {
        if (profiles.length > 0) {
            initializeScannerStatuses(profiles);
        } else {
            // Bail out on the same reference when already empty — a fresh {} on every
            // effect run could loop the render if `profiles` ever becomes referentially
            // unstable again.
            setStatusById(prev => (Object.keys(prev).length === 0 ? prev : {}));
        }
    }, [profiles, initializeScannerStatuses]);

    const startPolling = useCallback((profileId: string) => {
        // Optimistically mark running right away — the real confirmation comes from
        // the slow poll below (a scan runs for hours, 15s is plenty).
        setStatusById(s => ({
            ...s,
            [profileId]: { ...(s[profileId] || { running: false }), running: true },
        }));

        if (intervalsRef.current[profileId]) {
            return;
        }

        const intervalId = setInterval(async () => {
            try {
                const status = await fetchScannerStatus(profileId);
                setStatusById(prev => ({ ...prev, [profileId]: status }));

                if (!status.running && intervalsRef.current[profileId]) {
                    clearInterval(intervalsRef.current[profileId]);
                    delete intervalsRef.current[profileId];
                }
            } catch {
                // ignore transient errors
            }
        }, 15000);

        intervalsRef.current[profileId] = intervalId;
    }, []);

    // POST /scanner/stop responds success immediately, but the actual cleanup
    // (the background orchestrator flipping isScannerRunning to false) happens
    // asynchronously, after the in-flight step — which can include OCR/landing
    // capture/Drive upload, seconds to tens of seconds — actually finishes. So
    // this polls the real status until running:false instead of guessing a
    // timeout, holding the button in "Stopping..." the whole time.
    const confirmStopped = useCallback(async (profileId: string): Promise<void> => {
        const maxAttempts = 20;
        const intervalMs = 1500;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const status = await fetchScannerStatus(profileId);
                setStatusById(prev => ({ ...prev, [profileId]: status }));
                if (!status.running) return;
            } catch {
                // transient error — retry
            }
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
    }, []);

    useEffect(() => {
        return () => {
            Object.values(intervalsRef.current).forEach(id => clearInterval(id));
            intervalsRef.current = {};
        };
    }, []);

    const isScannerRunning = useCallback(
        (profileId: string) => !!statusById[profileId]?.running,
        [statusById]
    );

    const isScannerPaused = useCallback(
        (profileId: string) => !!statusById[profileId]?.paused,
        [statusById]
    );

    const pauseMsLeft = useCallback(
        (profileId: string) => {
            const t = statusById[profileId]?.pausedUntil ?? null;
            if (!t) return 0;
            return Math.max(0, t - Date.now());
        },
        [statusById]
    );

    return {
        statusById,
        setStatusById,
        startPolling,
        confirmStopped,
        isScannerRunning,
        isScannerPaused,
        pauseMsLeft,
    };
};
