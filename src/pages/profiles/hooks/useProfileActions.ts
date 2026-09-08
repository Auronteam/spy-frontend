import { useCallback, useState } from 'react';
import { runVisionProfile, stopVisionProfileOnServer } from '@/api/vision-browser';
import { runScanner, stopScanner } from '@/api/scanner';
import { toast } from 'sonner';
import { notifyError } from '@/lib/errors/notify-error';
import { isApiError } from '@/lib/errors/api-error';

interface UseProfileActionsProps {
    folderId: string | null;
    refreshActiveProfiles: () => Promise<void>;
    startPolling: (profileId: string) => void;
    confirmStopped: (profileId: string) => Promise<void>;
    isScannerRunning: (profileId: string) => boolean;
}

// Tracks which profile ids currently have a pending action of one kind —
// each of the four actions below (start/stop vision, start/stop scanner)
// needs its own independent set, since they can be in flight for different
// profiles at once.
function usePendingIds() {
    const [ids, setIds] = useState<Record<string, boolean>>({});

    const start = useCallback((id: string) => {
        setIds(prev => ({ ...prev, [id]: true }));
    }, []);

    const stop = useCallback((id: string) => {
        setIds(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    }, []);

    return { ids, start, stop };
}

export const useProfileActions = ({
    folderId,
    refreshActiveProfiles,
    startPolling,
    confirmStopped,
    isScannerRunning,
}: UseProfileActionsProps) => {
    const { ids: startingIds, start: markStarting, stop: unmarkStarting } = usePendingIds();
    const { ids: stoppingIds, start: markStopping, stop: unmarkStopping } = usePendingIds();
    const {
        ids: scannerStartingIds,
        start: markScannerStarting,
        stop: unmarkScannerStarting,
    } = usePendingIds();
    const {
        ids: scannerStoppingIds,
        start: markScannerStopping,
        stop: unmarkScannerStopping,
    } = usePendingIds();

    const handleRunVision = useCallback(
        async (profileId: string) => {
            try {
                markStarting(profileId);

                await runVisionProfile(profileId, folderId ?? undefined);

                await refreshActiveProfiles();
            } catch (e) {
                notifyError(e);
            } finally {
                unmarkStarting(profileId);
            }
        },
        [folderId, refreshActiveProfiles, markStarting, unmarkStarting]
    );

    const handleRunScanner = useCallback(
        async (profileId: string) => {
            if (!folderId) {
                toast.error('Folder not selected');
                return;
            }

            try {
                markScannerStarting(profileId);

                await runScanner(profileId, folderId);
                startPolling(profileId);

                // Clear starting state after a short delay; polling will reflect running state
                setTimeout(() => {
                    unmarkScannerStarting(profileId);
                }, 1500);
            } catch (e) {
                notifyError(e);
                unmarkScannerStarting(profileId);
            }
        },
        [folderId, startPolling, markScannerStarting, unmarkScannerStarting]
    );

    const handleStopScanner = useCallback(
        async (profileId: string) => {
            try {
                markScannerStopping(profileId);

                await stopScanner(profileId);

                // /scanner/stop responds success immediately, but the actual stop
                // (background orchestrator) can take time — hold "Stopping..." until
                // confirmStopped sees running:false, instead of a guessed timeout.
                await confirmStopped(profileId);

                await refreshActiveProfiles();
            } catch (e) {
                const errorMessage = isApiError(e) ? e.message : 'Failed to stop scanner';

                if (errorMessage.includes('Failed to stop Vision profile')) {
                    toast.error(
                        `Failed to properly disconnect scanner and Vision Browser: ${errorMessage}\n\nPlease try again. If the issue persists, try stopping the Vision Browser manually first.`
                    );
                } else {
                    notifyError(e, errorMessage);
                }
            } finally {
                unmarkScannerStopping(profileId);
            }
        },
        [confirmStopped, refreshActiveProfiles, markScannerStopping, unmarkScannerStopping]
    );

    const handleStopVision = useCallback(
        async (profileId: string) => {
            if (!folderId) {
                toast.error('Folder not selected');
                return;
            }

            try {
                markStopping(profileId);

                if (isScannerRunning(profileId)) {
                    await stopScanner(profileId);
                    await confirmStopped(profileId);
                }

                await stopVisionProfileOnServer(profileId, folderId);

                await refreshActiveProfiles();
            } catch (e) {
                notifyError(e);
            } finally {
                unmarkStopping(profileId);
            }
        },
        [
            folderId,
            refreshActiveProfiles,
            isScannerRunning,
            confirmStopped,
            markStopping,
            unmarkStopping,
        ]
    );

    return {
        handleRunVision,
        handleRunScanner,
        handleStopScanner,
        handleStopVision,
        startingIds,
        stoppingIds,
        scannerStoppingIds,
        scannerStartingIds,
    };
};
