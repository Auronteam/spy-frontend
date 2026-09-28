import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Category } from '@/api/db/categories';
import { cn } from '@/lib/utils';

interface CategoryRowProps {
    category: Category;
    onEdit: () => void;
    onDelete: () => void;
}

export const CategoryRow = ({ category, onEdit, onDelete }: CategoryRowProps) => {
    const deleteButton = (
        <Button
            variant="outline"
            size="sm"
            className={cn(
                'text-destructive hover:text-destructive',
                category.protected
                    ? 'cursor-not-allowed opacity-50 hover:bg-background'
                    : 'hover:bg-destructive/10'
            )}
            aria-disabled={category.protected || undefined}
            onClick={category.protected ? undefined : onDelete}
        >
            Delete
        </Button>
    );

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="text-sm font-medium">{category.title}</span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                    Edit
                </Button>
                {category.protected ? (
                    <Tooltip>
                        <TooltipTrigger asChild>{deleteButton}</TooltipTrigger>
                        <TooltipContent>Protected categories cannot be deleted</TooltipContent>
                    </Tooltip>
                ) : (
                    deleteButton
                )}
            </div>
        </div>
    );
};
