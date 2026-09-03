import type { PaginationRangeItem } from '@/pages/content/types';
import { BACKEND_BASE } from '@/config';
import { withAuthToken } from '@/lib/client-auth';

export function extractDriveId(input?: string): string | undefined {
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

export function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export function getPaginationRange(
    current: number,
    total: number,
    siblings = 1
): PaginationRangeItem[] {
    const totalNumbers = siblings * 2 + 5; // first, last, current, 2*siblings, 2 ellipsis
    if (total <= totalNumbers) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);
    const showLeftEllipsis = left > 2;
    const showRightEllipsis = right < total - 1;

    const range: PaginationRangeItem[] = [1];
    if (showLeftEllipsis) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (showRightEllipsis) range.push('...');
    range.push(total);
    return range;
}
