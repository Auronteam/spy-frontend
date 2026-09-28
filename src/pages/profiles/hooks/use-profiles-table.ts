import { useMemo, useState } from 'react';
import type { Profile } from '@/types/profile';
import { formatPageSummary } from '../utils/format-page-summary';

const PAGE_SIZE = 10;

type UseProfilesTableResult = {
    search: string;
    setSearch: (value: string) => void;
    filteredProfiles: Profile[];
    pagedProfiles: Profile[];
    currentPage: number;
    totalPages: number;
    summary: string;
    goPrev: () => void;
    goNext: () => void;
};

export function useProfilesTable(profiles: Profile[]): UseProfilesTableResult {
    const [search, setSearchState] = useState('');
    const [page, setPage] = useState(1);

    const filteredProfiles = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return profiles;
        return profiles.filter(p => p.name.toLowerCase().includes(q));
    }, [profiles, search]);

    const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pagedProfiles = filteredProfiles.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const summary = formatPageSummary(
        currentPage,
        PAGE_SIZE,
        pagedProfiles.length,
        filteredProfiles.length,
        profiles.length
    );

    const setSearch = (value: string) => {
        setSearchState(value);
        setPage(1);
    };

    const goPrev = () => setPage(currentPage - 1);
    const goNext = () => setPage(currentPage + 1);

    return {
        search,
        setSearch,
        filteredProfiles,
        pagedProfiles,
        currentPage,
        totalPages,
        summary,
        goPrev,
        goNext,
    };
}
