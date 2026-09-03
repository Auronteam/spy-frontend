// Thin wrapper — keeps @sentry/react (~45KB gzip) out of the main bundle.
// Never import sentry-factory.ts directly, only through this file.
import type * as SentryFactoryModule from '@/lib/errors/sentry-factory';

type SentryFactory = typeof SentryFactoryModule;

let factory: SentryFactory | null = null;
let loadingPromise: Promise<SentryFactory> | null = null;

function ensureFactory(): Promise<SentryFactory> {
    loadingPromise ??= import('@/lib/errors/sentry-factory').then(module => {
        factory = module;
        return module;
    });
    return loadingPromise;
}

export function initSentry(): void {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    void ensureFactory().then(module => module.initSentryInstance());
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
    if (!import.meta.env.PROD) {
        console.error('[Sentry would capture]:', error, context);
        return;
    }

    if (factory) {
        factory.captureExceptionInstance(error, context);
        return;
    }
    void ensureFactory().then(module => module.captureExceptionInstance(error, context));
}

export function getLastEventId(): string | undefined {
    return factory?.lastEventIdInstance();
}
