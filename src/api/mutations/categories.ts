import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { categoryKeys } from '@/api/queries/categories';
import type { IItemResponse, IListResponse, IProductCategory } from '@/types';

export interface CategoryCreateInput {
    name: string;
    description?: string;
    image?: string;
    isActive?: boolean;
}

export type CategoryUpdateInput = Partial<CategoryCreateInput>;

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CategoryCreateInput) =>
            apiFetch<IItemResponse<IProductCategory>>('/categories', { method: 'POST', body: input }),

        // Inject a fake category into every cached list immediately so the UI updates without waiting on the server.
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

            const previousLists = queryClient.getQueriesData<IListResponse<IProductCategory>>({ queryKey: categoryKeys.lists() });

            const optimisticCategory: IProductCategory = {
                id: `temp-${Date.now()}`,
                name: input.name,
                description: input.description,
                image: input.image,
                isActive: input.isActive ?? true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            queryClient.setQueriesData<IListResponse<IProductCategory>>({ queryKey: categoryKeys.lists() }, (old) =>
                old ? { ...old, data: [optimisticCategory, ...old.data] } : old
            );

            return { previousLists };
        },

        // Roll back to the snapshot taken in onMutate if the request fails.
        onError: (_err, _input, context) => {
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
}

export function useUpdateCategory(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CategoryUpdateInput) =>
            apiFetch<IItemResponse<IProductCategory>>(`/categories/${id}`, { method: 'PUT', body: input }),

        // Patch the category in both the detail cache and every cached list immediately.
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: categoryKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

            const previousDetail = queryClient.getQueryData<IItemResponse<IProductCategory>>(categoryKeys.detail(id));
            const previousLists = queryClient.getQueriesData<IListResponse<IProductCategory>>({ queryKey: categoryKeys.lists() });

            queryClient.setQueryData<IItemResponse<IProductCategory>>(categoryKeys.detail(id), (old) =>
                old ? { ...old, data: { ...old.data, ...input } } : old
            );

            queryClient.setQueriesData<IListResponse<IProductCategory>>({ queryKey: categoryKeys.lists() }, (old) =>
                old
                    ? { ...old, data: old.data.map((category) => (category.id === id ? { ...category, ...input } : category)) }
                    : old
            );

            return { previousDetail, previousLists };
        },

        // Roll back both caches to their pre-mutation snapshots if the request fails.
        onError: (_err, _input, context) => {
            if (context?.previousDetail) queryClient.setQueryData(categoryKeys.detail(id), context.previousDetail);
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),

        // Remove the category from every cached list immediately.
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

            const previousLists = queryClient.getQueriesData<IListResponse<IProductCategory>>({ queryKey: categoryKeys.lists() });

            queryClient.setQueriesData<IListResponse<IProductCategory>>({ queryKey: categoryKeys.lists() }, (old) =>
                old ? { ...old, data: old.data.filter((category) => category.id !== id) } : old
            );

            return { previousLists };
        },

        // Roll back to the snapshot taken in onMutate if the request fails.
        onError: (_err, _id, context) => {
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
}
