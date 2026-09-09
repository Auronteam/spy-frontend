import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createCategory,
    deleteCategory,
    getCategoriesList,
    updateCategory,
} from '@/api/db/categories';

const CATEGORIES_QUERY_KEY = ['categories', 'list'];

export function useCategories() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: getCategoriesList,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: invalidate,
    });

    const updateMutation = useMutation({
        mutationFn: ({ slug, title }: { slug: string; title: string }) =>
            updateCategory(slug, { title }),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: invalidate,
    });

    return {
        categories: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        createCategory: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateCategory: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteCategory: deleteMutation.mutate,
    };
}
