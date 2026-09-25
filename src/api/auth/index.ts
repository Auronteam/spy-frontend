import { apiFetch } from '@/lib/api-fetch';
import type { UserRole } from '@/types/auth';

export type AuthUser = {
    login: string;
    role: UserRole;
};

export type LoginPayload = {
    login: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: AuthUser;
};

export type VerifyResponse = {
    user: AuthUser;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    return apiFetch<LoginResponse>(
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
}

export async function verifyToken(token: string): Promise<VerifyResponse> {
    return apiFetch<VerifyResponse>(
        '/api/auth/verify',
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        },
        { skipAuthRedirect: true }
    );
}
