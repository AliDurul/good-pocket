import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { IItemResponse, IListResponse, IProduct } from '@/types';

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    isActive?: boolean;
    categoryId?: string;
}

export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(filters: ProductFilters = {}) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => apiFetch<IListResponse<IProduct>>('/products', { query: filters }),
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => apiFetch<IItemResponse<IProduct>>(`/products/${id}`),
        enabled: !!id,
    });
}
