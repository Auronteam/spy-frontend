import { Badge } from '@/components/ui/badge';
import { getFlagEmoji } from '@/lib/country';
import { getDriveFileSrc } from '@/api/google';
import type { Post } from '@/api/db/types';

interface ContentCardProps {
    post: Post;
    onClick: (post: Post) => void;
}

export const ContentCard = ({ post, onClick }: ContentCardProps) => (
    <button
        type="button"
        onClick={() => onClick(post)}
        className="flex w-full flex-col overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-ring/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
        <div className="aspect-thumb bg-muted">
            <img
                src={getDriveFileSrc(post.creativeImageUrl)}
                alt={`${post.category.title} creative — ${post.geo}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
            />
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="text-sm leading-none">{getFlagEmoji(post.geo)}</span>
                <span className="font-mono">{post.geo}</span>
            </span>
            <Badge variant="secondary" className="whitespace-nowrap">
                {post.category.title}
            </Badge>
        </div>
    </button>
);
