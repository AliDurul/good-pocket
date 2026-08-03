export interface IPagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface IListResponse<T> {
    success: true;
    data: T[];
    pagination: IPagination;
}

export interface IItemResponse<T> {
    success: true;
    data: T;
}
