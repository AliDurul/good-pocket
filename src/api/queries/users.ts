import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { IItemResponse, IListResponse, IUser } from '@/types';

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    roles?: string;
}

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers(filters: UserFilters = {}) {
    return useQuery({
        queryKey: userKeys.list(filters),
        queryFn: () => apiFetch<IListResponse<IUser>>('/users', { query: filters }),
    });
}

export function useUser(id: string) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => apiFetch<IItemResponse<IUser>>(`/users/${id}`),
        enabled: !!id,
    });
}
