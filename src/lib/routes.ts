import type { UserRole } from '@/types/auth';

export const ROUTES = {
    login: '/login',
    profiles: '/profiles',
    content: '/content',
    logs: '/logs',
    categories: '/categories',
    settings: '/settings',
} as const;

// Admin lands on Profiles, everyone else on Content — the one place this
// decision is made; RootRedirect, GuestRoute and LoginPage all defer to it.
export function getHomeRoute(role: UserRole | undefined): string {
    return role === 'admin' ? ROUTES.profiles : ROUTES.content;
}
