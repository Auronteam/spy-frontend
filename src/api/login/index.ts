import { apiFetch } from '@/lib/api-fetch';
import { isApiError } from '@/lib/errors/api-error';

export interface LoginPayload {
    login: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        login: string;
        role: string;
    };
    error?: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    try {
        return await apiFetch<LoginResponse>(
            '/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            },
            { skipAuthRedirect: true }
        );
    } catch (err) {
        return { success: false, error: isApiError(err) ? err.message : 'Network error' };
    }
}
