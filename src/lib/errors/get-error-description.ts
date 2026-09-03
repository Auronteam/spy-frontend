export function getErrorDescription(error: unknown, eventId?: string): string | undefined {
    if (!import.meta.env.PROD) {
        if (error instanceof Error) return error.message;
        try {
            return typeof error === 'string' ? error : JSON.stringify(error);
        } catch {
            return String(error);
        }
    }

    if (eventId) return `Error ID: ${eventId}`;
    return undefined;
}
