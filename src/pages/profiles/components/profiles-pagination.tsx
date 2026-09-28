import { Button } from '@/components/ui/button';

interface ProfilesPaginationProps {
    summary: string;
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}

export const ProfilesPagination = ({
    summary,
    currentPage,
    totalPages,
    onPrev,
    onNext,
}: ProfilesPaginationProps) => (
    <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
        <span>{summary}</span>
        <div className="flex gap-1.5">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={onPrev}>
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={onNext}
            >
                Next
            </Button>
        </div>
    </div>
);
