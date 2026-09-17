import { apiFetch } from '@/lib/api-fetch';

export async function updateVisionToken(token: string): Promise<{ validUntil: string | null }> {
    return apiFetch('/api/settings/vision-token', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });
}
