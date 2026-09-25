const REGIONAL_INDICATOR_OFFSET = 127397;

const regionNames = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });

export function isCountryCode(code: string): boolean {
    return /^[A-Za-z]{2}$/.test(code);
}

export function getFlagEmoji(code: string): string | null {
    if (!isCountryCode(code)) return null;
    return String.fromCodePoint(
        ...code
            .toUpperCase()
            .split('')
            .map(char => REGIONAL_INDICATOR_OFFSET + char.charCodeAt(0))
    );
}

export function getCountryName(code: string): string | null {
    if (!isCountryCode(code)) return null;
    try {
        return regionNames.of(code.toUpperCase()) ?? null;
    } catch {
        return null;
    }
}
