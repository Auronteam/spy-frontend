import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type AuthUser, verifyToken } from '@/api/auth';
import { forceLogout } from '@/lib/api-fetch';
import { clearClientAuthToken, getClientAuthToken, setClientAuthToken } from '@/lib/client-auth';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getClientAuthToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        verifyToken(token).then(result => {
            if (cancelled) return;
            if (result.success && result.user) {
                setUser(result.user);
            } else {
                // Stale/invalid token — clear it so the next load doesn't retry
                // a verify call that's already known to fail.
                clearClientAuthToken();
            }
            setIsLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const login = (token: string, user: AuthUser) => {
        setClientAuthToken(token);
        setUser(user);
    };

    const logout = () => {
        setIsLoading(true);
        setUser(null);
        forceLogout();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
