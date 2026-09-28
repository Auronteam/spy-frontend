import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/db/posts';
import { queryKeys } from '@/lib/query-keys';
import type { PostFilters } from '@/api/db/types';

type UsePostsQueryParams = {
    page: number;
    pageSize: number;
    filters: PostFilters;
};

export function usePostsQuery({ page, pageSize, filters }: UsePostsQueryParams) {
    const query = useQuery({
        queryKey: queryKeys.posts.list(page, pageSize, filters),
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
