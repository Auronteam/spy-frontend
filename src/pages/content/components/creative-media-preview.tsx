import { Badge } from '@/components/ui/badge';

interface CreativeMediaPreviewProps {
    videoKey: string;
    hasVideo: boolean;
    videoSrc?: string;
    posterSrc?: string;
    alt: string;
}

export const CreativeMediaPreview = ({
    videoKey,
    hasVideo,
    videoSrc,
    posterSrc,
    alt,
}: CreativeMediaPreviewProps) => {
    return (
        <div className="relative w-full overflow-hidden rounded-lg bg-muted md:h-full">
            {hasVideo ? (
                <video
                    key={videoKey}
                    src={videoSrc}
                    poster={posterSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="block h-full w-full object-contain"
                />
            ) : (
                <img src={posterSrc} alt={alt} className="block h-full w-full object-contain" />
            )}
            {hasVideo && (
                <Badge variant="secondary" className="absolute left-2 top-2">
                    VIDEO
                </Badge>
            )}
        </div>
    );
};
