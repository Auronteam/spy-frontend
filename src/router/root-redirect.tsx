import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { ROUTES } from '@/lib/routes';

export const RootRedirect = () => {
    const { user } = useAuth();
    return <Navigate to={user?.role === 'admin' ? ROUTES.profiles : ROUTES.content} replace />;
};
