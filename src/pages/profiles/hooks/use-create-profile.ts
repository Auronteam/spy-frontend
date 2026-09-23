import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVisionProfile } from '@/api/vision-browser';
import { notifyError } from '@/lib/errors/notify-error';
import { queryKeys } from '@/lib/query-keys';
import type { CreateProfileInput } from '@/pages/profiles/types';

export function useCreateProfile(folderId: string | null) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (input: CreateProfileInput) => {
            if (!folderId) {
                return Promise.reject(new Error('Folder not selected'));
            }
            return createVisionProfile(folderId, input);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.vision.profiles(folderId) });
        },
        onError: e => notifyError(e),
    });

    return {
        createProfile: mutation.mutateAsync,
        isCreating: mutation.isPending,
    };
}
