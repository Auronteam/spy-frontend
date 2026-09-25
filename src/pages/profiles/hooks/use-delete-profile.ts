import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteVisionProfile } from '@/api/vision-browser';
import { isApiError } from '@/lib/errors/api-error';
import { notifyError } from '@/lib/errors/notify-error';
import { queryKeys } from '@/lib/query-keys';

export function useDeleteProfile(folderId: string | null) {
    const queryClient = useQueryClient();

    const invalidateProfiles = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.vision.profiles(folderId) });

    const mutation = useMutation({
        mutationFn: (profileId: string) => {
            if (!folderId) {
                return Promise.reject(new Error('Folder not selected'));
            }
            return deleteVisionProfile(folderId, profileId);
        },
        onSuccess: invalidateProfiles,
        onError: e => {
            if (isApiError(e) && e.status === 404) {
                toast.info('This profile no longer exists in Vision');
                invalidateProfiles();
                return;
            }
            if (isApiError(e) && e.status === 409) {
                invalidateProfiles();
                queryClient.invalidateQueries({ queryKey: queryKeys.vision.activeProfiles() });
            }
            notifyError(e);
        },
    });

    return {
        deleteProfile: mutation.mutate,
        isDeleting: mutation.isPending,
    };
}
