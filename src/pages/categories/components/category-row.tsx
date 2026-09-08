import { Button } from '@/components/ui/button';
import type { Category } from '@/api/db/categories';

interface CategoryRowProps {
    category: Category;
    onEdit: () => void;
    onDelete: () => void;
}

export const CategoryRow = ({ category, onEdit, onDelete }: CategoryRowProps) => (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <span className="text-sm font-medium">{category.title}</span>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="text-red-700 hover:bg-red-50 hover:text-red-700"
                onClick={onDelete}
                disabled={category.protected}
                title={category.protected ? 'Protected categories cannot be deleted' : undefined}
            >
                Delete
            </Button>
        </div>
    </div>
);
