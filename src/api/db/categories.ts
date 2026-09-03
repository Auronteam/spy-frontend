import { apiFetch } from '@/lib/api-fetch';
import type { PagedResponse } from '@/api/db/dto';

export type { PagedResponse } from '@/api/db/dto';

export type Category = {
    slug: string;
    title: string;
    protected: boolean;
};

export async function fetchCategories(
    page = 1,
    pageSize = 10,
    categoryFilter?: string
): Promise<PagedResponse<Category>> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (categoryFilter && categoryFilter.trim()) {
        params.append('category', categoryFilter.trim());
    }

    return apiFetch<PagedResponse<Category>>(`/api/categories?${params.toString()}`, {
        cache: 'no-store',
    });
}

export async function getCategoriesList(): Promise<Category[]> {
    const data = await apiFetch<PagedResponse<Category>>('/api/categories?pageSize=1000', {
        cache: 'no-store',
    });
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
