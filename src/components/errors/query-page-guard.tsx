import type { ReactNode } from 'react';
import { PageError } from '@/components/errors/page-error';
import { isApiError } from '@/lib/errors/api-error';

interface QueryPageGuardProps {
    isLoading?: boolean;
    loadingFallback?: ReactNode;
    isError: boolean;
    error: unknown;
    onRetry?: () => void;
    title?: string;
    unknownMessage?: string;
    children: ReactNode;
}

// Shared loading/error wrapper for a page query, instead of repeating the same
// {isError ? <PageError/> : children} on every page.
export const QueryPageGuard = ({
    isLoading,
    loadingFallback = null,
    isError,
    error,
    onRetry,
    title = 'Failed to load',
    unknownMessage,
    children,
}: QueryPageGuardProps) => {
    if (isLoading) return <>{loadingFallback}</>;

    if (isError) {
        return (
            <PageError
                title={title}
                description={isApiError(error) ? error.message : unknownMessage}
                onRetry={onRetry}
            />
        );
    }

    return <>{children}</>;
};
