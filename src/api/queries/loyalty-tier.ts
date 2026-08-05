import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { IItemResponse, IListResponse, IProductCategory } from '@/types';

export interface loyaltyFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    isActive?: boolean;
}

export const loyaltyKeys = {
    all: ['loyalty-tiers'] as const,
    lists: () => [...loyaltyKeys.all, 'list'] as const,
    list: (filters: loyaltyFilters) => [...loyaltyKeys.lists(), filters] as const,
    details: () => [...loyaltyKeys.all, 'detail'] as const,
    detail: (id: string) => [...loyaltyKeys.details(), id] as const,
};

export function useLoyaltyTiers(filters: loyaltyFilters = {}) {
    return useQuery({
        queryKey: loyaltyKeys.list(filters),
        queryFn: () => apiFetch<IListResponse<any>>('/loyalty-tiers', { query: filters }),
    });
}

export function useLoyaltyTier(id: string) {
    return useQuery({
        queryKey: loyaltyKeys.detail(id),
        queryFn: () => apiFetch<IItemResponse<any>>(`/loyalty-tiers/${id}`),
        enabled: !!id,
    });
}
