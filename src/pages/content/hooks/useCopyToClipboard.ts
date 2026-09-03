import { useCallback, useState } from 'react';

const RESET_DELAY_MS = 1500;

export type UseCopyToClipboardResult = {
    copiedKey: string | null;
    copy: (text: string, key: string) => Promise<void>;
};

// Falls back to execCommand for environments without navigator.clipboard
// access (e.g. non-HTTPS/older browsers).
export function useCopyToClipboard(): UseCopyToClipboardResult {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copy = useCallback(async (text: string, key: string) => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
            } finally {
                document.body.removeChild(ta);
            }
        }
        setCopiedKey(key);
        window.setTimeout(() => {
            setCopiedKey(prev => (prev === key ? null : prev));
        }, RESET_DELAY_MS);
    }, []);

    return { copiedKey, copy };
}
