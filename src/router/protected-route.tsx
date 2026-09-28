import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types/auth';
import { Spinner } from '@/components/ui/spinner';
import { SessionVerifyError } from '@/router/session-verify-error';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
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

    if (!user) {
        return <Navigate to={ROUTES.login} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={ROUTES.content} replace />;
    }

    return <Outlet />;
};
