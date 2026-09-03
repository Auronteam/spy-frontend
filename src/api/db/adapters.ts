import type { PostDto } from '@/api/db/dto';
import type { Post } from '@/pages/content/types';

export function mapPostDtoToPost(dto: PostDto): Post {
    return {
        hash: dto.hash,
        authorLink: dto.author_link,
        landingUrl: dto.landing_url,
        googleDriveFolderId: dto.google_drive_folder_id,
        category: dto.category,
        geo: dto.geo,
        creativeType: dto.creative_type,
        createdAt: dto.created_at,
        creativeImageUrl: dto.creative_image_url,
        landingArchiveUrl: dto.landing_archive_url,
        landingScreenUrl: dto.landing_screen_url,
        creativeVideoUrl: dto.creative_video_url ?? undefined,
    };
}
