import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { ROUTES } from '@/lib/routes';

export const TopNav = () => {
    const { pathname } = useLocation();
    const { user, logout, isLoading } = useAuth();

    const allSections = [
        { href: ROUTES.profiles, label: 'Profiles' },
        { href: ROUTES.content, label: 'Content' },
        { href: ROUTES.logs, label: 'Logs' },
        { href: ROUTES.settings, label: 'Settings' },
    ];

    const sections =
        user?.role === 'admin'
            ? allSections
            : user?.role === 'user'
              ? [{ href: ROUTES.content, label: 'Content' }]
              : [];

    return (
        <nav className="flex justify-between items-center p-3 border-b border-gray-300">
            <div className="flex gap-3">
                {sections.map(s => {
                    const isActive = pathname === s.href;
                    return (
                        <Link
                            key={s.href}
                            to={s.href}
                            className={`no-underline font-medium ${
                                isActive
                                    ? 'text-blue-700 font-bold'
                                    : 'text-gray-900 hover:text-blue-600'
                            }`}
                        >
                            {s.label}
                        </Link>
                    );
                })}
            </div>

            {user && (
                <div className="flex items-center gap-3">
                    <span className="text-gray-900 font-medium">Hello, {user.role}!</span>
                    <button
                        onClick={logout}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-red-500 text-white border-0 rounded cursor-pointer font-medium hover:bg-red-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Logging out...' : 'Log out'}
                    </button>
                </div>
            )}
        </nav>
    );
};
