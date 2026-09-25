import type { ProfileProxy, UpdateProfileInput } from '@/pages/profiles/types';

export function formatProxy(proxy: ProfileProxy | null): string {
    return proxy ? `${proxy.ip}:${proxy.port}` : '';
}

export function buildProfileUpdate(
    currentName: string,
    nameInput: string,
    currentProxy: string,
    proxyInput: string
): UpdateProfileInput | null {
    const update: UpdateProfileInput = {};

    const trimmedName = nameInput.trim();
    if (trimmedName !== currentName) {
        update.profileName = trimmedName;
    }

    const trimmedProxy = proxyInput.trim();
    if (trimmedProxy !== currentProxy) {
        update.proxyString = trimmedProxy || null;
    }

    return Object.keys(update).length > 0 ? update : null;
}
