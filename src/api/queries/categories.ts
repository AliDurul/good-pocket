import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { IItemResponse, IListResponse, IProductCategory } from '@/types';

export interface CategoryFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    isActive?: boolean;
}

export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (filters: CategoryFilters) => [...categoryKeys.lists(), filters] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export function useCategories(filters: CategoryFilters = {}) {
    return useQuery({
        queryKey: categoryKeys.list(filters),
        queryFn: () => apiFetch<IListResponse<IProductCategory>>('/categories', { query: filters }),
    });
}

export function useCategory(id: string) {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => apiFetch<IItemResponse<IProductCategory>>(`/categories/${id}`),
        enabled: !!id,
    });
}
