import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVisionProfile } from '@/api/vision-browser';
import { isApiError } from '@/lib/errors/api-error';
import { notifyError } from '@/lib/errors/notify-error';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateProfileInput } from '@/pages/profiles/types';

type UpdateProfileVariables = {
    profileId: string;
    input: UpdateProfileInput;
};

export function useUpdateProfile(folderId: string | null) {
    const queryClient = useQueryClient();

    const invalidateProfiles = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.vision.profiles(folderId) });

    const mutation = useMutation({
        mutationFn: ({ profileId, input }: UpdateProfileVariables) => {
            if (!folderId) {
                return Promise.reject(new Error('Folder not selected'));
            }
            return updateVisionProfile(folderId, profileId, input);
        },
        onSuccess: invalidateProfiles,
        onError: e => {
            if (isApiError(e) && e.status === 409) {
                invalidateProfiles();
                queryClient.invalidateQueries({ queryKey: queryKeys.vision.activeProfiles() });
            }
            notifyError(e);
        },
    });

    return {
        updateProfile: mutation.mutate,
        isUpdating: mutation.isPending,
    };
}
