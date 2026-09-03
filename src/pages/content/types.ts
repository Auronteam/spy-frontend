import type { Category } from '@/api/db/categories';

export type PaginationRangeItem = number | '...';

export type Post = {
    hash: string;
    authorLink: string;
    landingUrl: string;
    googleDriveFolderId: string;
    category: Category;
    geo: string;
    creativeType: string;
    createdAt: string;
    creativeImageUrl: string;
    landingArchiveUrl: string;
    landingScreenUrl: string;
    creativeVideoUrl?: string;
};
