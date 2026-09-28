import { useState, useMemo } from 'react';
import { getPaginationRange } from '../utils';

type PageState<T> = {
    page: number;
    resetKey: T;
};

export function usePagination<T>(resetKey: T, pageSize = 24) {
    const [state, setState] = useState<PageState<T>>({ page: 1, resetKey });
    const page = Object.is(state.resetKey, resetKey) ? state.page : 1;

    const goToPage = (newPage: number, totalPages: number) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        setState({ page: newPage, resetKey });

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
        pageSize,
        goToPage,
        pagesRange,
    };
}
