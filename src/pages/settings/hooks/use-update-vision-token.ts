import { useMutation } from '@tanstack/react-query';
import { updateVisionToken } from '@/api/settings';

type UseUpdateVisionTokenResult = {
    saveToken: (token: string) => void;
    isPending: boolean;
    isSuccess: boolean;
    validUntil: string | null;
};

export function useUpdateVisionToken(): UseUpdateVisionTokenResult {
    const mutation = useMutation({ mutationFn: updateVisionToken });

    const saveToken = (token: string): void => {
        const trimmed = token.trim();
        if (!trimmed) return;
        mutation.mutate(trimmed);
    };

    return {
        saveToken,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        validUntil: mutation.data?.validUntil ?? null,
    };
}
