import { useQuery } from '@tanstack/react-query';
import { fetchScannerStatus } from '@/api/scanner';

export function useSelectedProfileScanner(profileId: string) {
    const query = useQuery({
        queryKey: ['scanner', 'status', profileId],
        queryFn: () => fetchScannerStatus(profileId),
        enabled: Boolean(profileId),
        refetchInterval: profileId ? 10_000 : false,
    });

    return { isRunning: query.data?.running ?? false };
}
