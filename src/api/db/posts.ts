import type { Post, PostFilters } from '@/api/db/types';
import { mapPostDtoToPost } from '@/api/db/adapters';
import type { PagedResponse, PostDto } from '@/api/db/dto';
import { apiFetch } from '@/lib/api-fetch';

export type { PagedResponse } from '@/api/db/dto';

function endOfLocalDay(date: Date): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
}

export async function fetchPosts(
    page = 1,
    pageSize = 24,
    filters?: PostFilters
): Promise<PagedResponse<Post>> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (filters) {
        if (filters.createdAt?.from) params.append('from', filters.createdAt.from.toISOString());
        if (filters.createdAt?.to) {
            params.append('to', endOfLocalDay(filters.createdAt.to).toISOString());
        }

        Object.entries(filters).forEach(([key, values]) => {
            if (key === 'createdAt' || !values) return;

            if (Array.isArray(values) && values.length > 0) {
                values.forEach(value => params.append(key, value));
            }
        });
    }

    const dto = await apiFetch<PagedResponse<PostDto>>(`/api/posts?${params.toString()}`, {
        cache: 'no-store',
    });

    return { ...dto, items: dto.items.map(mapPostDtoToPost) };
}
