import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { runScanner as runScannerApi } from '@/api/scanner';
import { notifyError } from '@/lib/errors/notify-error';
import { isApiError } from '@/lib/errors/api-error';
import { stopScannerAndWait } from './scanner-stop';

export function useScannerActions(profileId: string, folderId: string | null) {
    const queryClient = useQueryClient();

    const runScannerMutation = useMutation({
        mutationFn: async () => {
            await runScannerApi(profileId, folderId!);
            // Refetch now instead of guessing when the backend has actually
            // started it — the badge switches to Running as soon as the real
            // status says so.
            await queryClient.invalidateQueries({ queryKey: ['scanner', 'status', profileId] });
        },
        onError: e => notifyError(e),
    });

    const stopScannerMutation = useMutation({
        mutationFn: () => stopScannerAndWait(queryClient, profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vision', 'active-profiles'] });
        },
        onError: e => {
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

    const runScanner = () => {
        if (!folderId) {
            toast.error('Folder not selected');
            return;
        }
        runScannerMutation.mutate();
    };

    return {
        runScanner,
        stopScanner: () => stopScannerMutation.mutate(),
        isStarting: runScannerMutation.isPending,
        isStopping: stopScannerMutation.isPending,
    };
}
