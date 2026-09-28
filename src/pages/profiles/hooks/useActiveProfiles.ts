import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveVisionProfiles } from '@/api/vision-browser';
import { queryKeys } from '@/lib/query-keys';

type UseActiveProfilesResult = {
    activeProfileIds: string[];
    error: Error | null;
    refreshActiveProfiles: () => Promise<void>;
    isVisionActive: (profileId: string) => boolean;
};

export function useActiveProfiles(folderId: string | null): UseActiveProfilesResult {
    const { data, error, refetch } = useQuery({
        queryKey: queryKeys.vision.activeProfiles(),
        queryFn: fetchActiveVisionProfiles,
        enabled: !!folderId,
        refetchInterval: folderId ? 3000 : false,
    });

    const activeProfileIds = useMemo(() => {
        if (!data) return [];
        const items = Array.isArray(data) ? data : (data.profiles ?? data.activeProfiles ?? []);
        return items.map(p => p.profile_id).filter((id): id is string => !!id);
    }, [data]);

    const refreshActiveProfiles = useCallback(async () => {
        await refetch();
    }, [refetch]);

    const isVisionActive = useCallback(
        (profileId: string) => activeProfileIds.includes(profileId),
        [activeProfileIds]
    );

    return {
        activeProfileIds,
        error,
        refreshActiveProfiles,
        isVisionActive,
    };
}
