import { useState, useMemo } from 'react';
import { getPaginationRange } from '../utils';

export function usePagination(initialPage = 1, pageSize = 24) {
    const [page, setPage] = useState(initialPage);

    const goToPage = (newPage: number, totalPages: number) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        setPage(newPage);

        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const pagesRange = useMemo(
        () => (totalPages: number) => getPaginationRange(page, totalPages, 1),
        [page]
    );

    return {
        page,
        setPage,
        pageSize,
        goToPage,
        pagesRange,
    };
}
