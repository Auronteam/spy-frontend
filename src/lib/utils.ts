import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function truncateString(str: string): string {
    if (str.length <= 12) {
        return str;
    }
    return str.substring(0, 12) + '...';
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

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
