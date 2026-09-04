import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { ProtectedRoute } from '@/router/protected-route';
import { GuestRoute } from '@/router/guest-route';
import { DashboardLayout } from '@/router/dashboard-layout';
import { RootRedirect } from '@/router/root-redirect';
import { LoginPage } from '@/pages/login/login-page';
import { ContentPage } from '@/pages/content/content-page';
import { ProfilesPage } from '@/pages/profiles/profiles-page';
import { LogsPage } from '@/pages/logs/logs-page';
import { CategoriesPage } from '@/pages/categories/categories-page';
import { SettingsPage } from '@/pages/settings/settings-page';

export const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        children: [{ path: ROUTES.login, element: <LoginPage /> }],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <RootRedirect /> },
                    { path: ROUTES.content, element: <ContentPage /> },
                    {
                        element: <ProtectedRoute allowedRoles={['admin']} />,
                        children: [
                            { path: ROUTES.profiles, element: <ProfilesPage /> },
                            { path: ROUTES.logs, element: <LogsPage /> },
                            { path: ROUTES.categories, element: <CategoriesPage /> },
                            { path: ROUTES.settings, element: <SettingsPage /> },
                        ],
                    },
                ],
            },
        ],
    },
]);
