import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { getHomeRoute } from '@/lib/routes';
import { Spinner } from '@/components/ui/spinner';
import { SessionVerifyError } from '@/router/session-verify-error';

export const GuestRoute = () => {
    const { user, isLoading, verifyError, retry } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (verifyError) {
        return <SessionVerifyError description={verifyError} onRetry={retry} />;
    }

    if (user) {
        return <Navigate to={getHomeRoute(user.role)} replace />;
    }

    return <Outlet />;
};
