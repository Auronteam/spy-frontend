import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>spy-frontend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                        <p>
                            Scaffold: Vite + React 19 + TanStack Query + shadcn/ui. Routing and auth
                            land in the next branch.
                        </p>
                        <Button size="sm" className="self-start">
                            shadcn button works
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </QueryClientProvider>
    );
}

export default App;
