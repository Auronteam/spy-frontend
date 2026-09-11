import { Badge } from '@/components/ui/badge';
import { getDriveFileSrc, getFlagEmoji } from '../utils';
import type { Post } from '../types';

interface ContentCardProps {
    post: Post;
    onClick: (post: Post) => void;
}

export const ContentCard = ({ post, onClick }: ContentCardProps) => (
    <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(post)}
        onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(post);
            }
        }}
        className="flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-zinc-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
        <div className="aspect-[4/3] bg-muted">
            <img
                src={getDriveFileSrc(post.creativeImageUrl)}
                alt={`${post.category.title} creative — ${post.geo}`}
                className="h-full w-full object-cover"
            />
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                <span className="text-sm leading-none">{getFlagEmoji(post.geo)}</span>
                <span className="font-mono">{post.geo}</span>
            </span>
            <Badge variant="secondary" className="whitespace-nowrap">
                {post.category.title}
            </Badge>
        </div>
    </div>
);
