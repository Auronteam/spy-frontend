export function formatPageSummary(
    page: number,
    pageSize: number,
    shownCount: number,
    matchingCount: number,
    totalCount: number
): string {
    if (matchingCount === 0) {
        return totalCount === 0 ? 'No profiles' : `No matches (${totalCount} total)`;
    }

    const start = (page - 1) * pageSize + 1;
    const end = start + shownCount - 1;
    const summary = `${start}–${end} of ${matchingCount} profiles`;

    return matchingCount === totalCount ? summary : `${summary} (${totalCount} total)`;
}
