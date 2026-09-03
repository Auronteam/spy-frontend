import { apiFetch } from '@/lib/api-fetch';
import { ApiError } from '@/lib/errors/api-error';

export async function getCountriesList(): Promise<string[]> {
    const data = await apiFetch<unknown>('/api/countries', { cache: 'no-store' });

    if (!Array.isArray(data) || !data.every((x): x is string => typeof x === 'string')) {
        throw new ApiError('Invalid response format for countries');
    }
    return data;
}
