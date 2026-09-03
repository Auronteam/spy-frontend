import type { Filters } from '@/pages/content/hooks/useFilters';
import type { Post } from '@/pages/content/types';
import { mapPostDtoToPost } from '@/api/db/adapters';
import type { PagedResponse, PostDto } from '@/api/db/dto';
import { apiFetch } from '@/lib/api-fetch';

export type { PagedResponse } from '@/api/db/dto';

export async function fetchPosts(
    page = 1,
    pageSize = 24,
    filters?: Filters
): Promise<PagedResponse<Post>> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (filters) {
        if (filters.createdAt?.from) params.append('from', filters.createdAt.from.toISOString());
        if (filters.createdAt?.to) params.append('to', filters.createdAt.to.toISOString());

        Object.entries(filters).forEach(([key, values]) => {
            if (key === 'createdAt' || !values) return;

            if (Array.isArray(values) && values.length > 0) {
                values.forEach(value => params.append(key, value));
            }
        });
    }

    const dto = await apiFetch<PagedResponse<PostDto>>(`/api/posts?${params.toString()}`, {
        cache: 'force-cache',
    });

    return { ...dto, items: dto.items.map(mapPostDtoToPost) };
}
