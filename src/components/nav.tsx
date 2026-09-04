import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const TopNav = () => {
    const { pathname } = useLocation();
    const { user, logout, isLoading } = useAuth();

    const allSections = [
        { href: ROUTES.profiles, label: 'Profiles' },
        { href: ROUTES.content, label: 'Content' },
        { href: ROUTES.logs, label: 'Logs' },
        { href: ROUTES.categories, label: 'Categories' },
        { href: ROUTES.settings, label: 'Settings' },
    ];

    const sections =
        user?.role === 'admin'
            ? allSections
            : user?.role === 'user'
              ? [{ href: ROUTES.content, label: 'Content' }]
              : [];

    return (
        <header className="border-b bg-background">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-sm bg-foreground" />
                    <span className="font-semibold">Scanner Console</span>
                </div>

                {user && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Hi, {user.login}</span>
                        <Button variant="outline" size="sm" onClick={logout} disabled={isLoading}>
                            {isLoading ? 'Logging out...' : 'Log out'}
                        </Button>
                    </div>
                )}
            </div>

            <nav className="flex gap-6 px-6">
                {sections.map(s => {
                    const isActive = pathname === s.href;
                    return (
                        <Link
                            key={s.href}
                            to={s.href}
                            className={cn(
                                'border-b-2 pb-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'border-foreground text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {s.label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
};
