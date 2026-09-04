import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { QueryProvider } from '@/providers/query-provider';
import { SentryInit } from '@/providers/sentry-init';
import { router } from '@/router/router';

const App = () => (
    <QueryProvider>
        <SentryInit />
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
        <Toaster />
    </QueryProvider>
);

export default App;
