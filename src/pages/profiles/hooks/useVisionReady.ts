import { useQueries } from '@tanstack/react-query';
import { fetchVisionReady } from '@/api/vision-browser';

interface Profile {
    id: string;
}

type UseVisionReadyReturn = {
    isVisionReady: (profileId: string) => boolean;
};

const READY_POLL_INTERVAL_MS = 2500;

// Polls backend readiness for active profiles via TanStack Query — one query
// per profile, enabled only while it's vision-active, polling stops itself
// once ready:true comes back (function-form refetchInterval).
export function useVisionReady(
    profiles: Profile[],
    isVisionActive: (profileId: string) => boolean
): UseVisionReadyReturn {
    const queries = useQueries({
        queries: profiles.map(profile => ({
            queryKey: ['vision', 'ready', profile.id],
            queryFn: () => fetchVisionReady(profile.id),
            enabled: isVisionActive(profile.id),
            refetchInterval: (query: { state: { data?: { ready: boolean } } }) =>
                query.state.data?.ready ? false : READY_POLL_INTERVAL_MS,
        })),
    });

    const isVisionReady = (profileId: string): boolean => {
        // Not active means readiness is meaningless even if a stale cached
        // response from a previous active period still says ready:true.
        if (!isVisionActive(profileId)) return false;
        const index = profiles.findIndex(p => p.id === profileId);
        return index !== -1 ? !!queries[index]?.data?.ready : false;
    };

    return { isVisionReady };
}
