import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { login } from '@/api/auth';
import { useAuth } from '@/contexts/auth-context';
import { getHomeRoute } from '@/lib/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
    login: z.string().min(1, 'Login is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const [values, setValues] = useState<LoginFormValues>({ login: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login: setSession } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const parse = loginSchema.safeParse(values);
        if (!parse.success) {
            setError(parse.error.issues[0]?.message || 'Invalid data');
            return;
        }

        setIsLoading(true);
        try {
            const response = await login(parse.data);

            if (response.success && response.token && response.user) {
                setSession(response.token, response.user);
                navigate(getHomeRoute(response.user.role));
            } else {
                setError(response.error || 'Login failed');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-sm bg-foreground" />
                <span className="font-semibold">Spy Console</span>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
                    <CardDescription>Enter your credentials to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form autoComplete="on" className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="login">
                                Login
                            </label>
                            <Input
                                id="login"
                                name="username"
                                type="text"
                                placeholder="your login"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                inputMode="text"
                                disabled={isLoading}
                                value={values.login}
                                onChange={e =>
                                    setValues(prev => ({ ...prev, login: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="your password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                value={values.password}
                                onChange={e =>
                                    setValues(prev => ({ ...prev, password: e.target.value }))
                                }
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
