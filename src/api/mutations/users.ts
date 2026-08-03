import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { userKeys } from '@/api/queries/users';
import type { IItemResponse, IListResponse, IUser } from '@/types';

export interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    role?: 'customer' | 'agent' | 'officer' | 'admin';
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    birthday?: string;
    assignedAgentId?: string;
}

export interface UserUpdateInput {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    birthday?: string;
    assignedAgentId?: string;
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UserCreateInput) =>
            apiFetch<IItemResponse<IUser>>('/users', { method: 'POST', body: input }),

        // Inject a fake user into every cached list immediately so the UI updates without waiting on the server.
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: userKeys.lists() });

            const previousLists = queryClient.getQueriesData<IListResponse<IUser>>({ queryKey: userKeys.lists() });

            const now = new Date().toISOString();
            const optimisticUser: IUser = {
                id: `temp-${Date.now()}`,
                name: input.name,
                email: input.email,
                emailVerified: false,
                image: null,
                createdAt: now,
                updatedAt: now,
                role: input.role ?? 'customer',
                banned: false,
                banReason: null,
                banExpires: null,
                phone: input.phone ?? null,
                address: input.address ?? null,
                city: input.city ?? null,
                country: input.country ?? null,
                birthday: input.birthday ?? null,
                referralCode: '',
                walletBalance: 0,
                totalSpend: 0,
                assignedAgentId: input.assignedAgentId ?? null,
                tierId: null,
                assignedAgent: null,
                tier: null,
            };

            queryClient.setQueriesData<IListResponse<IUser>>({ queryKey: userKeys.lists() }, (old) =>
                old ? { ...old, data: [optimisticUser, ...old.data] } : old
            );

            return { previousLists };
        },

        // Roll back to the snapshot taken in onMutate if the request fails.
        onError: (_err, _input, context) => {
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

export function useUpdateUser(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UserUpdateInput) =>
            apiFetch<IItemResponse<IUser>>(`/users/${id}`, { method: 'PUT', body: input }),

        // Patch the user in both the detail cache and every cached list immediately.
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: userKeys.lists() });

            const previousDetail = queryClient.getQueryData<IItemResponse<IUser>>(userKeys.detail(id));
            const previousLists = queryClient.getQueriesData<IListResponse<IUser>>({ queryKey: userKeys.lists() });

            queryClient.setQueryData<IItemResponse<IUser>>(userKeys.detail(id), (old) =>
                old ? { ...old, data: { ...old.data, ...input } } : old
            );

            queryClient.setQueriesData<IListResponse<IUser>>({ queryKey: userKeys.lists() }, (old) =>
                old ? { ...old, data: old.data.map((user) => (user.id === id ? { ...user, ...input } : user)) } : old
            );

            return { previousDetail, previousLists };
        },

        // Roll back both caches to their pre-mutation snapshots if the request fails.
        onError: (_err, _input, context) => {
            if (context?.previousDetail) queryClient.setQueryData(userKeys.detail(id), context.previousDetail);
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiFetch<{ success: true; message: string }>(`/users/${id}`, { method: 'DELETE' }),

        // Remove the user from every cached list immediately.
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: userKeys.lists() });

            const previousLists = queryClient.getQueriesData<IListResponse<IUser>>({ queryKey: userKeys.lists() });

            queryClient.setQueriesData<IListResponse<IUser>>({ queryKey: userKeys.lists() }, (old) =>
                old ? { ...old, data: old.data.filter((user) => user.id !== id) } : old
            );

            return { previousLists };
        },

        // Roll back to the snapshot taken in onMutate if the request fails.
        onError: (_err, _id, context) => {
            context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },

        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: userKeys.detail(id) });
        },

        // Sync with the real server data either way.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}
