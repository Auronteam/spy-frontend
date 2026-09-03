import type { Category } from '@/api/db/categories';

export type PagedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

// Wire shape of the Post entity, as returned by the backend — snake_case,
// mirrors apps/backend's TypeORM entity columns directly.
export type PostDto = {
    hash: string;
    author_link: string;
    landing_url: string;
    google_drive_folder_id: string;
    category: Category;
    geo: string;
    creative_type: string;
    created_at: string;
    creative_image_url: string;
    landing_archive_url: string;
    landing_screen_url: string;
    creative_video_url?: string | null;
};
