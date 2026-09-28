import { useState, type FormEvent } from 'react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin, type LoginFormValues } from './hooks/use-login';

export const LoginPage = () => {
    const [values, setValues] = useState<LoginFormValues>({ login: '', password: '' });
    const { submit, error, isLoading } = useLogin();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void submit(values);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
            <Logo />

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
                    <CardDescription>Enter your credentials to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form autoComplete="on" className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="login">Login</Label>
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
                            <Label htmlFor="password">Password</Label>
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
                            <div
                                role="alert"
                                className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                            >
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
