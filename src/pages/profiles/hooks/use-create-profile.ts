import { useMutation, useQueryClient, type UseMutateAsyncFunction } from '@tanstack/react-query';
import { createVisionProfile } from '@/api/vision-browser';
import { queryKeys } from '@/lib/query-keys';
import type { CreateProfileInput } from '@/api/vision-browser/types';

type UseCreateProfileResult = {
    createProfile: UseMutateAsyncFunction<Record<string, unknown>, Error, CreateProfileInput>;
    isCreating: boolean;
};

export function useCreateProfile(folderId: string | null): UseCreateProfileResult {
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
    });

    return {
        createProfile: mutation.mutateAsync,
        isCreating: mutation.isPending,
    };
}
