import { skipToken, useQuery } from '@tanstack/react-query';
import { fetchVisionProfiles } from '@/api/vision-browser';
import type { Profile } from '@/pages/profiles/types';

// Stable reference: while folderId isn't chosen yet, the query is disabled
// (skipToken) and query.data stays undefined indefinitely — `?? []` would
// create a new array on every render the whole time, and consumers
// (useScannerStatus, useVisionReady) keep `profiles` in their effect deps.
const EMPTY_PROFILES: Profile[] = [];

export const useVisionProfiles = (folderId: string | null) => {
    const query = useQuery({
        queryKey: ['vision', 'profiles', folderId],
        queryFn: folderId ? () => fetchVisionProfiles(folderId) : skipToken,
    });

    return {
        profiles: query.data ?? EMPTY_PROFILES,
        loading: query.isLoading,
        error: query.error,
    };
};
