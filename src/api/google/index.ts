import { BACKEND_BASE } from '@/config';
import { withAuthToken } from '@/lib/client-auth';

function extractDriveId(input?: string): string | undefined {
    if (!input) return undefined;
    if (!input.includes('http') && /^[a-zA-Z0-9_-]{10,}$/.test(input)) return input;
    try {
        const u = new URL(input);
        const m1 = u.pathname.match(/\/file\/d\/([^/]+)/);
        if (m1?.[1]) return m1[1];
        const qid = u.searchParams.get('id');
        if (qid) return qid;
    } catch {
        // ignore
    }
    return input;
}

export function getDriveFileSrc(idOrUrl?: string): string | undefined {
    const fileId = extractDriveId(idOrUrl);
    return fileId ? withAuthToken(`${BACKEND_BASE}/api/google/drive/file/${fileId}`) : undefined;
}
