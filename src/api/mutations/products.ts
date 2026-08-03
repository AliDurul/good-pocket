import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { productKeys } from '@/api/queries/products';
import type { IItemResponse, IListResponse, IProduct } from '@/types';

export interface ProductCreateInput {
    name: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    categoryId: string;
}

export interface ProductUpdateInput {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    categoryId?: string;
    price?: number;
    stockQty?: number;
    lowStockThreshold?: number;
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ProductCreateInput) =>
            apiFetch<IItemResponse<IProduct>>('/products', { method: 'POST', body: input }),

        // Inject a fake product into every cached list immediately so the UI updates without waiting on the server.
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: productKeys.lists() });

            const previousLists = queryClient.getQueriesData<IListResponse<IProduct>>({ queryKey: productKeys.lists() });

            const optimisticProduct: IProduct = {
                id: `temp-${Date.now()}`,
                name: input.name,
                description: input.description,
                isActive: input.isActive ?? true,
                image: input.image,
                categoryId: input.categoryId,
                createdAt: new Date(),
                updatedAt: new Date(),
                category: undefined,
                variants: [],
            };

            queryClient.setQueriesData<IListResponse<IProduct>>({ queryKey: productKeys.lists() }, (old) =>
                old ? { ...old, data: [optimisticProduct, ...old.data] } : old
            );

            return { previousLists };
        },

        // Roll back to the snapshot taken in onMutate if the request fails.
        onError: (_err, _input, context) => {
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ProductUpdateInput) =>
            apiFetch<IItemResponse<IProduct>>(`/products/${id}`, { method: 'PUT', body: input }),

        // Patch the product in both the detail cache and every cached list immediately.
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: productKeys.lists() });

            const previousDetail = queryClient.getQueryData<IItemResponse<IProduct>>(productKeys.detail(id));
            const previousLists = queryClient.getQueriesData<IListResponse<IProduct>>({ queryKey: productKeys.lists() });

            const { price, stockQty, lowStockThreshold, ...productPatch } = input;

            queryClient.setQueryData<IItemResponse<IProduct>>(productKeys.detail(id), (old) =>
                old ? { ...old, data: { ...old.data, ...productPatch } } : old
            );

            queryClient.setQueriesData<IListResponse<IProduct>>({ queryKey: productKeys.lists() }, (old) =>
                old
                    ? { ...old, data: old.data.map((product) => (product.id === id ? { ...product, ...productPatch } : product)) }
                    : old
            );

            return { previousDetail, previousLists };
        },

        // Roll back both caches to their pre-mutation snapshots if the request fails.
        onError: (_err, _input, context) => {
            if (context?.previousDetail) queryClient.setQueryData(productKeys.detail(id), context.previousDetail);
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiFetch<void>(`/products/${id}`, { method: 'DELETE' }),

        // Remove the product from every cached list immediately.
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: productKeys.lists() });

            const previousLists = queryClient.getQueriesData<IListResponse<IProduct>>({ queryKey: productKeys.lists() });

            queryClient.setQueriesData<IListResponse<IProduct>>({ queryKey: productKeys.lists() }, (old) =>
                old ? { ...old, data: old.data.filter((product) => product.id !== id) } : old
            );

            return { previousLists };
        },

        // Roll back to the snapshot taken in onMutate if the request fails.
        onError: (_err, _id, context) => {
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: productKeys.detail(id) });
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}
