import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/db/posts';
import type { Filters } from './useFilters';

type UsePostsQueryParams = {
    page: number;
    pageSize: number;
    filters: Filters;
};

export function usePostsQuery({ page, pageSize, filters }: UsePostsQueryParams) {
    const query = useQuery({
        queryKey: ['posts', page, pageSize, filters],
        queryFn: () => fetchPosts(page, pageSize, filters),
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
