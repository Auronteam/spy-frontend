import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/db/posts';
import { queryKeys } from '@/lib/query-keys';
import type { PagedResponse } from '@/api/db/dto';
import type { Post, PostFilters } from '@/api/db/types';

type UsePostsQueryParams = {
    page: number;
    pageSize: number;
    filters: PostFilters;
};

export type UsePostsQueryResult = {
    data: PagedResponse<Post> | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
};

export function usePostsQuery({
    page,
    pageSize,
    filters,
}: UsePostsQueryParams): UsePostsQueryResult {
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
