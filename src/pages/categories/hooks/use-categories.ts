import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutateFunction,
} from '@tanstack/react-query';
import {
    createCategory,
    deleteCategory,
    getCategoriesList,
    updateCategory,
    type Category,
} from '@/api/db/categories';
import { queryKeys } from '@/lib/query-keys';

type CreateCategoryInput = Parameters<typeof createCategory>[0];

type UpdateCategoryInput = {
    slug: string;
    title: string;
};

export type UseCategoriesResult = {
    categories: Category[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    createCategory: UseMutateFunction<Category, Error, CreateCategoryInput>;
    isCreating: boolean;
    updateCategory: UseMutateFunction<Category, Error, UpdateCategoryInput>;
    isUpdating: boolean;
    deleteCategory: UseMutateFunction<void, Error, string>;
    isDeleting: boolean;
};

export function useCategories(): UseCategoriesResult {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: queryKeys.categories.list(),
        queryFn: getCategoriesList,
    });

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: invalidate,
    });

    const updateMutation = useMutation({
        mutationFn: ({ slug, title }: UpdateCategoryInput) => updateCategory(slug, { title }),
        onSuccess: () =>
            Promise.all([
                invalidate(),
                queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() }),
            ]),
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
        refetch: query.refetch,
        createCategory: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateCategory: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteCategory: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
