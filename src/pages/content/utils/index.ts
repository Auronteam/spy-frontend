import type { PaginationRangeItem } from '@/pages/content/types';

const DRIVE_FOLDER_BASE_URL = 'https://drive.google.com/drive/folders';

export function getDriveFolderUrl(folderId: string): string {
    return `${DRIVE_FOLDER_BASE_URL}/${folderId}`;
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

export function formatIsoToDMY(iso: string, separator: string = '.'): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    // UTC, to avoid timezone shifts
    const day = d.getUTCDate();
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(day)}${separator}${pad(month)}${separator}${year}`;
}
