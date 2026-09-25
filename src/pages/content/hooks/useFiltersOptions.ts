import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategoriesList } from '@/api/db/categories';
import { getCountriesList } from '@/api/db/countries';
import { notifyError } from '@/lib/errors/notify-error';
import { queryKeys } from '@/lib/query-keys';
import type { MultiSelectOption } from '../components/multiselect';

export function useFiltersOptions() {
    const categoriesQuery = useQuery({
        queryKey: queryKeys.categories.list(),
        queryFn: getCategoriesList,
    });
    const countriesQuery = useQuery({
        queryKey: queryKeys.countries.list(),
        queryFn: getCountriesList,
    });

    useEffect(() => {
        if (categoriesQuery.isError) {
            notifyError(categoriesQuery.error, 'Failed to load categories');
        }
    }, [categoriesQuery.isError, categoriesQuery.error]);

    useEffect(() => {
        if (countriesQuery.isError) {
            notifyError(countriesQuery.error, 'Failed to load countries');
        }
    }, [countriesQuery.isError, countriesQuery.error]);

    const categoriesOptions = useMemo<MultiSelectOption[]>(
        () =>
            (categoriesQuery.data ?? [])
                .map(c => ({ value: c.slug, label: c.title }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [categoriesQuery.data]
    );
    const countriesOptions = useMemo<MultiSelectOption[]>(
        () =>
            [...(countriesQuery.data ?? [])]
                .sort((a, b) => a.localeCompare(b))
                .map(code => ({ value: code, label: code })),
        [countriesQuery.data]
    );

    return {
        categoriesOptions,
        countriesOptions,
        loading: categoriesQuery.isLoading || countriesQuery.isLoading,
    };
}
