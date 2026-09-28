import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PostFilters } from '@/api/db/types';

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

type ListFilterKey = 'categories' | 'countries';

export type UseFiltersResult = {
    filters: PostFilters;
    setListFilter: (key: ListFilterKey, values: string[]) => void;
    setDateRange: (range: PostFilters['createdAt']) => void;
    clearAll: () => void;
};

export function useFilters(): UseFiltersResult {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo<PostFilters>(() => {
        const from = parseDateParam(searchParams.get('from'));
        const to = parseDateParam(searchParams.get('to'));
        return {
            categories: parseListParam(searchParams.get('categories')),
            countries: parseListParam(searchParams.get('countries')),
            createdAt: from || to ? { from, to } : undefined,
        };
    }, [searchParams]);

    const setListFilter = (key: ListFilterKey, values: string[]) => {
        setSearchParams(
            prev => {
                const next = new URLSearchParams(prev);
                if (values.length > 0) next.set(key, values.join(','));
                else next.delete(key);
                return next;
            },
            { replace: true }
        );
    };

    const setDateRange = (range: PostFilters['createdAt']) => {
        setSearchParams(
            prev => {
                const next = new URLSearchParams(prev);
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

    return { filters, setListFilter, setDateRange, clearAll };
}
