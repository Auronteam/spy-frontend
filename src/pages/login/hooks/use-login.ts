import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { login } from '@/api/auth';
import { useAuth } from '@/contexts/auth-context';
import { isApiError } from '@/lib/errors/api-error';
import { getHomeRoute } from '@/lib/routes';

const loginSchema = z.object({
    login: z.string().min(1, 'Login is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

type UseLoginResult = {
    submit: (values: LoginFormValues) => Promise<void>;
    error: string | null;
    isLoading: boolean;
};

export function useLogin(): UseLoginResult {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login: setSession } = useAuth();

    const submit = async (values: LoginFormValues): Promise<void> => {
        setError(null);

        const parse = loginSchema.safeParse(values);
        if (!parse.success) {
            setError(parse.error.issues[0]?.message || 'Invalid data');
            return;
        }

        setIsLoading(true);
        try {
            const { token, user } = await login(parse.data);
            setSession(token, user);
            navigate(getHomeRoute(user.role));
        } catch (err) {
            setError(isApiError(err) ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return { submit, error, isLoading };
}
