import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { runVisionProfile, stopVisionProfileOnServer } from '@/api/vision-browser';
import { notifyError } from '@/lib/errors/notify-error';
import { stopScannerAndWait } from './scanner-stop';

export function useVisionActions(
    profileId: string,
    folderId: string | null,
    scannerRunning: boolean
) {
    const queryClient = useQueryClient();

    const runVisionMutation = useMutation({
        mutationFn: () => runVisionProfile(profileId, folderId ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vision', 'active-profiles'] });
        },
        onError: e => notifyError(e),
    });

    const stopVisionMutation = useMutation({
        mutationFn: async () => {
            if (scannerRunning) {
                await stopScannerAndWait(queryClient, profileId);
            }
            await stopVisionProfileOnServer(profileId, folderId!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vision', 'active-profiles'] });
        },
        onError: e => notifyError(e),
    });

    const stopVision = () => {
        if (!folderId) {
            toast.error('Folder not selected');
            return;
        }
        stopVisionMutation.mutate();
    };

    return {
        runVision: () => runVisionMutation.mutate(),
        stopVision,
        isStarting: runVisionMutation.isPending,
        isStopping: stopVisionMutation.isPending,
    };
}
