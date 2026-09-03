import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

export type Filters = {
    categories: string[];
    countries: string[];
    createdAt?: DateRange;
};

export function useFilters(initial?: Partial<Filters>) {
    const [filters, setFilters] = useState<Filters>({
        categories: [],
        countries: [],
        ...initial,
    });

    const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearAll = () => {
        setFilters({
            categories: [],
            countries: [],
            createdAt: undefined,
        });
    };

    return { filters, setFilter, clearAll };
}
