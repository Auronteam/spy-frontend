import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategoriesList } from '@/api/db/categories';
import { getCountriesList } from '@/api/db/countries';
import { notifyError } from '@/lib/errors/notify-error';

export function useFiltersOptions() {
    const categoriesQuery = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: getCategoriesList,
    });
    const countriesQuery = useQuery({
        queryKey: ['countries', 'list'],
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

    const categoriesOptions = useMemo(
        () =>
            (categoriesQuery.data ?? [])
                .map(c => c.title.toLowerCase())
                .sort((a, b) => a.localeCompare(b)),
        [categoriesQuery.data]
    );
    const countriesOptions = useMemo(
        () => [...(countriesQuery.data ?? [])].sort((a, b) => a.localeCompare(b)),
        [countriesQuery.data]
    );

    return {
        categoriesOptions,
        countriesOptions,
        loading: categoriesQuery.isLoading || countriesQuery.isLoading,
    };
}
