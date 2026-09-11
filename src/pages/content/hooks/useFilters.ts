import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type DateRange } from 'react-day-picker';

export type Filters = {
    categories: string[];
    countries: string[];
    createdAt?: DateRange;
};

// Date-only, UTC — avoids the local-timezone shift a plain toISOString()
// would introduce for dates near midnight (same reasoning as
// lib/utils.ts's formatIsoToDMY).
function formatDateParam(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function parseDateParam(value: string | null): Date | undefined {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const date = new Date(`${value}T00:00:00Z`);
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
