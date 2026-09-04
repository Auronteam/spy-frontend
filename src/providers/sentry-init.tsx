import { useEffect } from 'react';
import { initSentry } from '@/lib/errors/sentry';

export const SentryInit = () => {
    useEffect(() => {
        initSentry();
    }, []);

    return null;
};
