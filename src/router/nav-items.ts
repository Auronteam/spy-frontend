import type { ComponentType } from 'react';
import { ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types/auth';

export type NavItem = {
    path: string;
    label: string;
    lazy: () => Promise<{ Component: ComponentType }>;
    // undefined — any authenticated role, regardless of what it is
    allowedRoles?: UserRole[];
};

// Single source for both the route tree (router.tsx) and the nav links
// (components/nav.tsx) — a route's role gate and its nav visibility can't
// drift from each other because both read the same entry.
export const NAV_ITEMS: NavItem[] = [
    {
        path: ROUTES.profiles,
        label: 'Profiles',
        lazy: () =>
            import('@/pages/profiles/profiles-page').then(m => ({ Component: m.ProfilesPage })),
        allowedRoles: ['admin'],
    },
    {
        path: ROUTES.content,
        label: 'Content',
        lazy: () =>
            import('@/pages/content/content-page').then(m => ({ Component: m.ContentPage })),
    },
    {
        path: ROUTES.logs,
        label: 'Logs',
        lazy: () => import('@/pages/logs/logs-page').then(m => ({ Component: m.LogsPage })),
        allowedRoles: ['admin'],
    },
    {
        path: ROUTES.categories,
        label: 'Categories',
        lazy: () =>
            import('@/pages/categories/categories-page').then(m => ({
                Component: m.CategoriesPage,
            })),
        allowedRoles: ['admin'],
    },
    {
        path: ROUTES.settings,
        label: 'Settings',
        lazy: () =>
            import('@/pages/settings/settings-page').then(m => ({ Component: m.SettingsPage })),
        allowedRoles: ['admin'],
    },
    {
        path: ROUTES.faq,
        label: 'FAQ',
        lazy: () => import('@/pages/faq/faq-page').then(m => ({ Component: m.FaqPage })),
    },
];
