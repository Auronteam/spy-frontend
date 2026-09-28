import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { NAV_ITEMS } from '@/router/nav-items';
import { ProtectedRoute } from '@/router/protected-route';
import { GuestRoute } from '@/router/guest-route';
import { DashboardLayout } from '@/router/dashboard-layout';
import { RootRedirect } from '@/router/root-redirect';
import { FullScreenSpinner } from '@/router/full-screen-spinner';

const publicItems = NAV_ITEMS.filter(item => !item.allowedRoles);
const adminItems = NAV_ITEMS.filter(item => item.allowedRoles?.includes('admin'));

export const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        HydrateFallback: FullScreenSpinner,
        children: [
            {
                path: ROUTES.login,
                lazy: () =>
                    import('@/pages/login/login-page').then(m => ({ Component: m.LoginPage })),
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        HydrateFallback: FullScreenSpinner,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <RootRedirect /> },
                    ...publicItems.map(({ path, lazy }) => ({ path, lazy })),
                    {
                        element: <ProtectedRoute allowedRoles={['admin']} />,
                        children: adminItems.map(({ path, lazy }) => ({ path, lazy })),
                    },
                ],
            },
        ],
    },
]);
