import * as Sentry from '@sentry/react';

export function initSentryInstance(): void {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        enabled: import.meta.env.PROD,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.2,
    });
}

export function captureExceptionInstance(
    error: unknown,
    context?: Record<string, unknown>
): string {
    return Sentry.captureException(error, { extra: context });
}

export function lastEventIdInstance(): string | undefined {
    return Sentry.lastEventId();
}
