import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { runVisionProfile, stopVisionProfileOnServer } from '@/api/vision-browser';
import { notifyError } from '@/lib/errors/notify-error';
import { mutationKeys, queryKeys } from '@/lib/query-keys';
import {
    fetchFreshScannerStatus,
    ScannerStopTimeoutError,
    stopScannerAndWait,
} from './scanner-stop';

export function useVisionActions(profileId: string, folderId: string | null) {
    const queryClient = useQueryClient();

    const runVisionMutation = useMutation({
        mutationKey: mutationKeys.vision.run(profileId),
        mutationFn: () => runVisionProfile(profileId, folderId ?? undefined),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.vision.ready(profileId) });
            return queryClient.invalidateQueries({ queryKey: queryKeys.vision.activeProfiles() });
        },
        onError: e => notifyError(e),
    });

    const stopVisionMutation = useMutation({
        mutationKey: mutationKeys.vision.stop(profileId),
        mutationFn: async () => {
            const scannerStatus = await fetchFreshScannerStatus(queryClient, profileId);
            if (scannerStatus.running) {
                await stopScannerAndWait(queryClient, profileId);
            }
            await stopVisionProfileOnServer(profileId, folderId!);
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.vision.ready(profileId) });
            return queryClient.invalidateQueries({ queryKey: queryKeys.vision.activeProfiles() });
        },
        onError: e => {
            if (e instanceof ScannerStopTimeoutError) {
                toast.error(e.message);
                return;
            }
            notifyError(e);
        },
    });

    const isStarting = useIsMutating({ mutationKey: mutationKeys.vision.run(profileId) }) > 0;
    const isStopping = useIsMutating({ mutationKey: mutationKeys.vision.stop(profileId) }) > 0;

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
        isStarting,
        isStopping,
    };
}
