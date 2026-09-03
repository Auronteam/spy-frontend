import { toast } from 'sonner';
import { isApiError } from '@/lib/errors/api-error';
import { captureError } from '@/lib/errors/sentry';

export function notifyError(error: unknown, fallback = 'Something went wrong'): void {
    if (!isApiError(error)) {
        captureError(error, { source: 'notifyError' });
        toast.error(fallback);
        return;
    }

    if (error.status === 403) {
        toast.error('You do not have permission to do that');
        return;
    }

    toast.error(error.message || fallback);
}
