import { skipToken, useQuery } from '@tanstack/react-query';
import { fetchScannerStatus } from '@/api/scanner';
import { queryKeys } from '@/lib/query-keys';

type UseSelectedProfileScannerResult = {
    isRunning: boolean;
};

export function useSelectedProfileScanner(
    profileId: string | null
): UseSelectedProfileScannerResult {
    const query = useQuery({
        queryKey: queryKeys.scanner.status(profileId),
        queryFn: profileId ? () => fetchScannerStatus(profileId) : skipToken,
        refetchInterval: profileId ? 10_000 : false,
    });

    return { isRunning: query.data?.running ?? false };
}
