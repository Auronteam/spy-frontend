import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { getHomeRoute } from '@/lib/routes';

export const RootRedirect = () => {
    const { user } = useAuth();
    return <Navigate to={getHomeRoute(user?.role)} replace />;
};
