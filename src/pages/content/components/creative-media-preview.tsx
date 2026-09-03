interface CreativeMediaPreviewProps {
    videoKey: string;
    hasVideo: boolean;
    videoSrc?: string;
    posterSrc?: string;
}

export const CreativeMediaPreview = ({
    videoKey,
    hasVideo,
    videoSrc,
    posterSrc,
}: CreativeMediaPreviewProps) => {
    return (
        <div className="relative w-full md:h-full">
            {hasVideo ? (
                <video
                    key={videoKey}
                    src={videoSrc}
                    poster={posterSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="block w-full h-full object-contain"
                />
            ) : (
                <img src={posterSrc} alt="Preview" className="block w-full h-full object-contain" />
            )}
        </div>
    );
};
