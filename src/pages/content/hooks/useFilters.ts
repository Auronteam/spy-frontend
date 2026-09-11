import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type DateRange } from 'react-day-picker';

export type Filters = {
    categories: string[];
    countries: string[];
    createdAt?: DateRange;
};

// Calendar hands us Date objects in local time (a click on "Sep 1" is local
// midnight Sep 1) — read/construct them in local time too, no UTC anywhere.
// Going through getUTC*()/a Z-suffixed ISO string here shifted the stored
// day backward by one for any positive UTC offset (local midnight Sep 1 is
// still Aug 31 in UTC).
function formatDateParam(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateParam(value: string | null): Date | undefined {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseListParam(value: string | null): string[] {
    return value ? value.split(',').filter(Boolean) : [];
}

export function useFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo<Filters>(() => {
        const from = parseDateParam(searchParams.get('from'));
        const to = parseDateParam(searchParams.get('to'));
        return {
            categories: parseListParam(searchParams.get('categories')),
            countries: parseListParam(searchParams.get('countries')),
            createdAt: from || to ? { from, to } : undefined,
        };
    }, [searchParams]);

    const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setSearchParams(
            prev => {
                const next = new URLSearchParams(prev);

                if (Array.isArray(value)) {
                    if (value.length > 0) next.set(key, value.join(','));
                    else next.delete(key);
                    return next;
                }

                // Only DateRange | undefined is left once the array case is
                // handled — TS can't narrow a generic K's value type from a
                // runtime Array.isArray check, so this one cast is real.
                const range = value as Filters['createdAt'];
                if (range?.from) next.set('from', formatDateParam(range.from));
                else next.delete('from');
                if (range?.to) next.set('to', formatDateParam(range.to));
                else next.delete('to');

                return next;
            },
            { replace: true }
        );
    };

    const clearAll = () => {
        setSearchParams({}, { replace: true });
    };

    return { filters, setFilter, clearAll };
}
