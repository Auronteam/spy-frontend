import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { runScanner as runScannerApi } from '@/api/scanner';
import { notifyError } from '@/lib/errors/notify-error';
import { isApiError } from '@/lib/errors/api-error';
import { mutationKeys, queryKeys } from '@/lib/query-keys';
import { ScannerStopTimeoutError, stopScannerAndWait } from './scanner-stop';

type UseScannerActionsResult = {
    runScanner: () => void;
    stopScanner: () => void;
    isStarting: boolean;
    isStopping: boolean;
};

export function useScannerActions(
    profileId: string,
    folderId: string | null
): UseScannerActionsResult {
    const queryClient = useQueryClient();

    const runScannerMutation = useMutation({
        mutationKey: mutationKeys.scanner.run(profileId),
        mutationFn: async (selectedFolderId: string) => {
            await runScannerApi(profileId, selectedFolderId);
            // Refetch now instead of guessing when the backend has actually
            // started it — the badge switches to Running as soon as the real
            // status says so.
            await queryClient.invalidateQueries({ queryKey: queryKeys.scanner.status(profileId) });
        },
    });

    const stopScannerMutation = useMutation({
        mutationKey: mutationKeys.scanner.stop(profileId),
        mutationFn: () => stopScannerAndWait(queryClient, profileId),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.vision.activeProfiles() }),
        onError: e => {
            if (e instanceof ScannerStopTimeoutError) {
                toast.error(e.message);
                return;
            }

            const errorMessage = isApiError(e) ? e.message : 'Failed to stop scanner';

            if (errorMessage.includes('Failed to stop Vision profile')) {
                toast.error(
                    `Failed to properly disconnect scanner and Vision Browser: ${errorMessage}\n\nPlease try again. If the issue persists, try stopping the Vision Browser manually first.`
                );
            } else {
                notifyError(e, errorMessage);
            }
        },
    });

    const isStarting = useIsMutating({ mutationKey: mutationKeys.scanner.run(profileId) }) > 0;
    const isStopping = useIsMutating({ mutationKey: mutationKeys.scanner.stop(profileId) }) > 0;

    const runScanner = () => {
        if (!folderId) {
            toast.error('Folder not selected');
            return;
        }
        runScannerMutation.mutate(folderId);
    };

    return {
        runScanner,
        stopScanner: () => stopScannerMutation.mutate(),
        isStarting,
        isStopping,
    };
}
