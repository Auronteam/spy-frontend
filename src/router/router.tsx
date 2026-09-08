import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { NAV_ITEMS } from '@/router/nav-items';
import { ProtectedRoute } from '@/router/protected-route';
import { GuestRoute } from '@/router/guest-route';
import { DashboardLayout } from '@/router/dashboard-layout';
import { RootRedirect } from '@/router/root-redirect';
import { LoginPage } from '@/pages/login/login-page';

const publicItems = NAV_ITEMS.filter(item => !item.allowedRoles);
const adminItems = NAV_ITEMS.filter(item => item.allowedRoles?.includes('admin'));

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
                    ...publicItems.map(({ path, element: Element }) => ({
                        path,
                        element: <Element />,
                    })),
                    {
                        element: <ProtectedRoute allowedRoles={['admin']} />,
                        children: adminItems.map(({ path, element: Element }) => ({
                            path,
                            element: <Element />,
                        })),
                    },
                ],
            },
        ],
    },
]);
