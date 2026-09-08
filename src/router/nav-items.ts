import type { ComponentType } from 'react';
import { ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types/auth';
import { ProfilesPage } from '@/pages/profiles/profiles-page';
import { ContentPage } from '@/pages/content/content-page';
import { LogsPage } from '@/pages/logs/logs-page';
import { CategoriesPage } from '@/pages/categories/categories-page';
import { SettingsPage } from '@/pages/settings/settings-page';

export type NavItem = {
    path: string;
    label: string;
    element: ComponentType;
    // undefined — any authenticated role, regardless of what it is
    allowedRoles?: UserRole[];
};

// Single source for both the route tree (router.tsx) and the nav links
// (components/nav.tsx) — a route's role gate and its nav visibility can't
// drift from each other because both read the same entry.
export const NAV_ITEMS: NavItem[] = [
    { path: ROUTES.profiles, label: 'Profiles', element: ProfilesPage, allowedRoles: ['admin'] },
    { path: ROUTES.content, label: 'Content', element: ContentPage },
    { path: ROUTES.logs, label: 'Logs', element: LogsPage, allowedRoles: ['admin'] },
    {
        path: ROUTES.categories,
        label: 'Categories',
        element: CategoriesPage,
        allowedRoles: ['admin'],
    },
    { path: ROUTES.settings, label: 'Settings', element: SettingsPage, allowedRoles: ['admin'] },
];
