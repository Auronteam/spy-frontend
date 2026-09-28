import { useState } from 'react';
import type { PaginationRangeItem } from '@/pages/content/types';
import { getPaginationRange } from '../utils';

type PageState<T> = {
    page: number;
    resetKey: T;
};

export type UsePaginationResult = {
    page: number;
    pageSize: number;
    goToPage: (newPage: number, totalPages: number) => void;
    getPagesRange: (totalPages: number) => PaginationRangeItem[];
};

export function usePagination<T>(resetKey: T, pageSize = 24): UsePaginationResult {
    const [state, setState] = useState<PageState<T>>({ page: 1, resetKey });
    const page = Object.is(state.resetKey, resetKey) ? state.page : 1;

    const goToPage = (newPage: number, totalPages: number) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        setState({ page: newPage, resetKey });

        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPagesRange = (totalPages: number): PaginationRangeItem[] =>
        getPaginationRange(page, totalPages, 1);

    return {
        page,
        pageSize,
        goToPage,
        getPagesRange,
    };
}
