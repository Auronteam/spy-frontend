import { apiFetch } from '@/lib/api-fetch';
import type { PagedResponse } from '@/api/db/dto';

export type Category = {
    slug: string;
    title: string;
    protected: boolean;
};

const MAX_PAGE_SIZE = 100;

export async function getCategoriesList(): Promise<Category[]> {
    const data = await apiFetch<PagedResponse<Category>>(
        `/api/categories?pageSize=${MAX_PAGE_SIZE}`,
        { cache: 'no-store' }
    );
    return data.items;
}

export async function getCategoriesWithPosts(): Promise<Category[]> {
    const data = await apiFetch<PagedResponse<Category>>(
        `/api/categories?scope=with-posts&pageSize=${MAX_PAGE_SIZE}`,
        { cache: 'no-store' }
    );
    return data.items;
}

export async function createCategory(categoryData: {
    title: string;
    slug: string;
    protected?: boolean;
}): Promise<Category> {
    return apiFetch<Category>('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
}

export async function updateCategory(
    slug: string,
    updateData: { title?: string; protected?: boolean }
): Promise<Category> {
    return apiFetch<Category>(`/api/categories/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
    });
}

export async function deleteCategory(slug: string): Promise<void> {
    await apiFetch<void>(`/api/categories/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
    });
}
