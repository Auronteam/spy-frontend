import { useEffect } from 'react';
import { QueryPageGuard } from '@/components/errors/query-page-guard';
import { Spinner } from '@/components/ui/spinner';
import { useFilters } from './hooks/useFilters';
import { useFiltersOptions } from './hooks/useFiltersOptions';
import { usePagination } from './hooks/usePagination';
import { usePostsQuery } from './hooks/usePostsQuery';
import { ContentFilters } from './components/content-filters';
import { ContentCard } from './components/content-card';
import { ContentPagination } from './components/pagination';

export const ContentPage = () => {
    const { filters, setFilter, clearAll } = useFilters();
    const { categoriesOptions, countriesOptions } = useFiltersOptions();
    const { page, setPage, pageSize, goToPage, pagesRange } = usePagination();
    const { data, isLoading, isError, error, refetch } = usePostsQuery({
        page,
        pageSize,
        filters,
    });

    useEffect(() => {
        setPage(1);
    }, [filters, setPage]);

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Content</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Items collected by the scanners.
                    </p>
                </div>
                <span className="text-sm text-muted-foreground">
                    {items.length} of {total} items
                </span>
            </div>

            <ContentFilters
                filters={filters}
                categoriesOptions={categoriesOptions}
                countriesOptions={countriesOptions}
                onCategoriesChange={value => setFilter('categories', value)}
                onCountriesChange={value => setFilter('countries', value)}
                onDateRangeChange={value => setFilter('createdAt', value)}
                onReset={clearAll}
            />

            <QueryPageGuard
                isLoading={isLoading}
                loadingFallback={
                    <div className="py-16">
                        <Spinner />
                    </div>
                }
                isError={isError}
                error={error}
                onRetry={refetch}
                title="Failed to load content"
            >
                {items.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
                        No content matches these filters.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                            {items.map(post => (
                                <ContentCard key={post.hash} post={post} />
                            ))}
                        </div>

                        <ContentPagination
                            page={page}
                            totalPages={totalPages}
                            canPrev={page > 1}
                            canNext={page < totalPages}
                            pagesRange={pagesRange(totalPages)}
                            goToPage={p => goToPage(p, totalPages)}
                        />
                    </>
                )}
            </QueryPageGuard>
        </div>
    );
};
