import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type AuthUser, verifyToken } from '@/api/auth';
import { forceLogout } from '@/lib/api-fetch';
import { clearClientAuthToken, getClientAuthToken, setClientAuthToken } from '@/lib/client-auth';
import { isApiError } from '@/lib/errors/api-error';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    verifyError: string | null;
    retry: () => void;
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
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [verifyAttempt, setVerifyAttempt] = useState(0);

    useEffect(() => {
        const token = getClientAuthToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        verifyToken(token)
            .then(result => {
                if (!cancelled) setUser(result.user);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                if (isApiError(err) && err.status === 401) {
                    clearClientAuthToken();
                    return;
                }
                setVerifyError(isApiError(err) ? err.message : 'Could not verify your session');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [verifyAttempt]);

    const retry = () => {
        setIsLoading(true);
        setVerifyError(null);
        setVerifyAttempt(attempt => attempt + 1);
    };

    const login = (token: string, user: AuthUser) => {
        setClientAuthToken(token);
        setVerifyError(null);
        setUser(user);
    };

    const logout = () => {
        setIsLoading(true);
        setUser(null);
        forceLogout();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, verifyError, retry, login, logout }}>
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
