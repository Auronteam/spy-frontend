import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { login } from '@/api/auth';
import { useAuth } from '@/contexts/auth-context';
import { ROUTES } from '@/lib/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
    login: z.string().min(1, 'Login is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login: setSession } = useAuth();

    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (values: LoginFormValues) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await login({ login: values.login, password: values.password });

            if (response.success && response.token && response.user) {
                setSession(response.token, response.user);
                navigate(response.user.role === 'admin' ? ROUTES.profiles : ROUTES.content);
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
        <div className="flex min-h-screen items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        method="post"
                        autoComplete="on"
                        className="space-y-4"
                        onSubmit={async e => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const raw = {
                                login: String(
                                    formData.get('login') || formData.get('username') || ''
                                ).trim(),
                                password: String(formData.get('password') || ''),
                            };
                            const parse = loginSchema.safeParse(raw);
                            if (!parse.success) {
                                setError(parse.error.issues[0]?.message || 'Invalid data');
                                return;
                            }
                            await onSubmit(parse.data);
                        }}
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="login">
                                Login
                            </label>
                            <Input
                                id="login"
                                name="username"
                                type="text"
                                placeholder="Enter your login"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                inputMode="text"
                                disabled={isLoading}
                                ref={loginRef}
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
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                ref={passwordRef}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
