import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { QueryPageGuard } from '@/components/errors/query-page-guard';
import type { Category } from '@/api/db/categories';
import { useCategories } from './hooks/use-categories';
import { CategoryRow } from './components/category-row';
import { AddCategoryDialog } from './components/add-category-dialog';
import { EditCategoryDialog } from './components/edit-category-dialog';

export const CategoriesPage = () => {
    const {
        categories,
        isLoading,
        isError,
        error,
        createCategory,
        isCreating,
        updateCategory,
        isUpdating,
        deleteCategory,
    } = useCategories();

    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Category | null>(null);

    const handleDelete = (category: Category) => {
        if (category.protected) return;
        const confirmed = window.confirm(
            `Delete category "${category.title}"? This also deletes every post in it.`
        );
        if (!confirmed) return;
        deleteCategory(category.slug);
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Categories</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Groups the scanners assign content to.
                    </p>
                </div>
                <Button onClick={() => setAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add category
                </Button>
            </div>

            <QueryPageGuard
                isLoading={isLoading}
                loadingFallback={
                    <div className="py-8">
                        <Spinner />
                    </div>
                }
                isError={isError}
                error={error}
                title="Failed to load categories"
            >
                <Card className="divide-y p-0">
                    {categories.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">No categories yet.</p>
                    ) : (
                        categories.map(category => (
                            <CategoryRow
                                key={category.slug}
                                category={category}
                                onEdit={() => setEditTarget(category)}
                                onDelete={() => handleDelete(category)}
                            />
                        ))
                    )}
                </Card>
            </QueryPageGuard>

            <AddCategoryDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                isPending={isCreating}
                onSubmit={values => createCategory(values, { onSuccess: () => setAddOpen(false) })}
            />

            <EditCategoryDialog
                category={editTarget}
                onOpenChange={open => {
                    if (!open) setEditTarget(null);
                }}
                isPending={isUpdating}
                onSubmit={title => {
                    if (!editTarget) return;
                    updateCategory(
                        { slug: editTarget.slug, title },
                        { onSuccess: () => setEditTarget(null) }
                    );
                }}
            />
        </div>
    );
};
