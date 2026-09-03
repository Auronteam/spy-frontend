import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveVisionProfiles } from '@/api/vision-browser';

export const useActiveProfiles = (folderId: string | null) => {
    const query = useQuery({
        queryKey: ['vision', 'active-profiles'],
        queryFn: fetchActiveVisionProfiles,
        enabled: !!folderId,
        refetchInterval: folderId ? 3000 : false,
    });

    const data = query.data;
    // useMemo is required — without it the array is recreated on every render
    // even when `data` hasn't changed, so isVisionActive below gets a new
    // reference each time, which loops useVisionReady's effect (it depends on
    // isVisionActive).
    const activeProfileIds = useMemo(() => {
        if (!data) return [];
        const items = Array.isArray(data) ? data : (data.profiles ?? data.activeProfiles ?? []);
        return items.map(p => p.profile_id).filter((id): id is string => !!id);
    }, [data]);

    const refreshActiveProfiles = useCallback(async () => {
        await query.refetch();
    }, [query.refetch]);

    const isVisionActive = useCallback(
        (profileId: string) => activeProfileIds.includes(profileId),
        [activeProfileIds]
    );

    return {
        activeProfileIds,
        loading: query.isLoading,
        error: query.error,
        refreshActiveProfiles,
        isVisionActive,
    };
};
