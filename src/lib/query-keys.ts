export const queryKeys = {
    vision: {
        folders: () => ['vision', 'folders'] as const,
        profiles: (folderId: string | null) => ['vision', 'profiles', folderId] as const,
        activeProfiles: () => ['vision', 'active-profiles'] as const,
        ready: (profileId: string) => ['vision', 'ready', profileId] as const,
    },
    scanner: {
        status: (profileId: string) => ['scanner', 'status', profileId] as const,
    },
    posts: {
        list: <TFilters>(page: number, pageSize: number, filters: TFilters) =>
            ['posts', page, pageSize, filters] as const,
    },
    categories: {
        all: () => ['categories'] as const,
        list: () => [...queryKeys.categories.all(), 'list'] as const,
    },
    countries: {
        list: () => ['countries', 'list'] as const,
    },
    logs: {
        all: () => ['logs'] as const,
        files: (profileId: string | null) => [...queryKeys.logs.all(), 'files', profileId] as const,
        content: (profileId: string | null, file: string) =>
            [...queryKeys.logs.all(), 'content', profileId, file] as const,
    },
};
