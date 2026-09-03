import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { ROUTES } from '@/lib/routes';
import Spinner from '@/components/ui/spinner';

export const GuestRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (user) {
        return <Navigate to={user.role === 'admin' ? ROUTES.profiles : ROUTES.content} replace />;
    }

    return <Outlet />;
};
