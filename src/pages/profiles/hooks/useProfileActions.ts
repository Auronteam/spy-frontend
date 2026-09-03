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

export const useProfileActions = ({
    folderId,
    refreshActiveProfiles,
    startPolling,
    confirmStopped,
    isScannerRunning,
}: UseProfileActionsProps) => {
    const [stoppingIds, setStoppingIds] = useState<Record<string, boolean>>({});
    const [startingIds, setStartingIds] = useState<Record<string, boolean>>({});
    const [scannerStoppingIds, setScannerStoppingIds] = useState<Record<string, boolean>>({});
    const [scannerStartingIds, setScannerStartingIds] = useState<Record<string, boolean>>({});

    const handleRunVision = useCallback(
        async (profileId: string) => {
            try {
                setStartingIds(prev => ({ ...prev, [profileId]: true }));

                await runVisionProfile(profileId, folderId ?? undefined);

                await refreshActiveProfiles();
            } catch (e) {
                notifyError(e);
            } finally {
                setStartingIds(prev => {
                    const copy = { ...prev };
                    delete copy[profileId];
                    return copy;
                });
            }
        },
        [folderId, refreshActiveProfiles]
    );

    const handleRunScanner = useCallback(
        async (profileId: string) => {
            if (!folderId) {
                toast.error('Folder not selected');
                return;
            }

            try {
                setScannerStartingIds(prev => ({ ...prev, [profileId]: true }));

                await runScanner(profileId, folderId);
                startPolling(profileId);

                // Clear starting state after a short delay; polling will reflect running state
                setTimeout(() => {
                    setScannerStartingIds(prev => {
                        const copy = { ...prev };
                        delete copy[profileId];
                        return copy;
                    });
                }, 1500);
            } catch (e) {
                notifyError(e);
                setScannerStartingIds(prev => {
                    const copy = { ...prev };
                    delete copy[profileId];
                    return copy;
                });
            }
        },
        [folderId, startPolling]
    );

    const handleStopScanner = useCallback(
        async (profileId: string) => {
            try {
                setScannerStoppingIds(prev => ({ ...prev, [profileId]: true }));

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
                setScannerStoppingIds(prev => {
                    const copy = { ...prev };
                    delete copy[profileId];
                    return copy;
                });
            }
        },
        [confirmStopped, refreshActiveProfiles]
    );

    const handleStopVision = useCallback(
        async (profileId: string) => {
            if (!folderId) {
                toast.error('Folder not selected');
                return;
            }

            try {
                setStoppingIds(prev => ({ ...prev, [profileId]: true }));

                if (isScannerRunning(profileId)) {
                    await stopScanner(profileId);
                    await confirmStopped(profileId);
                }

                await stopVisionProfileOnServer(profileId, folderId);

                await refreshActiveProfiles();
            } catch (e) {
                notifyError(e);
            } finally {
                setStoppingIds(prev => {
                    const copy = { ...prev };
                    delete copy[profileId];
                    return copy;
                });
            }
        },
        [folderId, refreshActiveProfiles, isScannerRunning, confirmStopped]
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
