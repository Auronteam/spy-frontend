import { useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatIsoToDMY } from '@/lib/utils';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { getDriveFileSrc, getDriveFolderUrl, getFlagEmoji } from '../utils';
import type { Post } from '../types';
import { CreativeMediaPreview } from './creative-media-preview';

interface CreativeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: Post | null;
}

interface CreativeLinkRowProps {
    label: string;
    url: string;
    copyKey: string;
    copiedKey: string | null;
    onCopy: (text: string, key: string) => void;
}

const CreativeLinkRow = ({ label, url, copyKey, copiedKey, onCopy }: CreativeLinkRowProps) => (
    <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-medium text-primary hover:underline"
            title={url}
        >
            {label}
        </a>
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => onCopy(url, copyKey)}
            aria-label={`Copy ${label} link`}
        >
            {copiedKey === copyKey ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
                <Copy className="h-3.5 w-3.5" />
            )}
        </Button>
    </div>
);

export const CreativeDialog = ({ open, onOpenChange, post }: CreativeDialogProps) => {
    const posterSrc = useMemo(
        () => (open && post ? getDriveFileSrc(post.creativeImageUrl) : undefined),
        [open, post]
    );
    const videoSrc = useMemo(
        () => (open && post?.creativeVideoUrl ? getDriveFileSrc(post.creativeVideoUrl) : undefined),
        [open, post]
    );
    const hasVideo = Boolean(videoSrc);
    const dateText = post?.createdAt ? formatIsoToDMY(post.createdAt) : '';

    const { copiedKey, copy: copyToClipboard } = useCopyToClipboard();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[92vw] sm:max-w-4xl">
                {post && (
                    <>
                        <DialogHeader className="mb-2">
                            <DialogTitle className="flex items-center gap-2 text-lg">
                                <Badge variant="secondary">{post.category.title}</Badge>
                                <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                                    <span className="text-base leading-none">
                                        {getFlagEmoji(post.geo)}
                                    </span>
                                    {post.geo}
                                </span>
                            </DialogTitle>
                            {dateText && (
                                <p className="mt-0.5 text-sm text-muted-foreground">{dateText}</p>
                            )}
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-5 md:h-[60vh] md:grid-cols-2">
                            <CreativeMediaPreview
                                videoKey={post.creativeVideoUrl ?? post.hash}
                                hasVideo={hasVideo}
                                videoSrc={videoSrc}
                                posterSrc={posterSrc}
                            />

                            <div className="flex flex-col gap-2.5">
                                {post.authorLink && (
                                    <CreativeLinkRow
                                        label="Author"
                                        url={post.authorLink}
                                        copyKey="author"
                                        copiedKey={copiedKey}
                                        onCopy={copyToClipboard}
                                    />
                                )}
                                {post.googleDriveFolderId && (
                                    <CreativeLinkRow
                                        label="Archive link to Google Drive"
                                        url={getDriveFolderUrl(post.googleDriveFolderId)}
                                        copyKey="archive"
                                        copiedKey={copiedKey}
                                        onCopy={copyToClipboard}
                                    />
                                )}
                                {post.landingUrl && (
                                    <CreativeLinkRow
                                        label="Landing link"
                                        url={post.landingUrl}
                                        copyKey="landing"
                                        copiedKey={copiedKey}
                                        onCopy={copyToClipboard}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
