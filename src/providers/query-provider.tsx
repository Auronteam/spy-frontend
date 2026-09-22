import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { isApiError } from '@/lib/errors/api-error';
import { captureError } from '@/lib/errors/sentry';
import { notifyError } from '@/lib/errors/notify-error';

interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error, query) => {
                        if (!isApiError(error)) {
                            captureError(error, { source: 'queryCache', queryKey: query.queryKey });
                        }
                    },
                }),
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 30_000,
                        gcTime: 5 * 60_000,
                        retry: (failureCount, error) =>
                            isApiError(error) && error.status && error.status < 500
                                ? false
                                : failureCount < 1,
                    },
                    mutations: {
                        onError: error => notifyError(error),
                    },
                },
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
