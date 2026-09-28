import {
    Pagination as UIPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import type { PaginationRangeItem } from '@/pages/content/types';

interface ContentPaginationProps {
    page: number;
    canPrev?: boolean;
    canNext?: boolean;
    pagesRange: PaginationRangeItem[];
    goToPage: (page: number) => void;
    className?: string;
}

export const ContentPagination = ({
    page,
    canPrev,
    canNext,
    pagesRange,
    goToPage,
    className,
}: ContentPaginationProps) => {
    return (
        <div className={cn('mb-3', className)}>
            <UIPagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            aria-disabled={!canPrev}
                            className={cn(!canPrev && 'pointer-events-none opacity-50')}
                            onClick={e => {
                                e.preventDefault();
                                if (canPrev) goToPage(page - 1);
                            }}
                        />
                    </PaginationItem>
                    {pagesRange.map((p: PaginationRangeItem, i: number) =>
                        p === '...' ? (
                            <PaginationItem key={`e-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={p === page}
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(p);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            aria-disabled={!canNext}
                            className={cn(!canNext && 'pointer-events-none opacity-50')}
                            onClick={e => {
                                e.preventDefault();
                                if (canNext) goToPage(page + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </UIPagination>
        </div>
    );
};
