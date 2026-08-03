import { ENV } from '@/config/env';
import { authClient } from '@/lib/auth-client';

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

type QueryValue = string | number | boolean | undefined | null;

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
    query?: object;
    body?: unknown;
}

function buildQueryString(query?: object) {
    if (!query) return '';
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query as Record<string, QueryValue>)) {
        if (value === undefined || value === null || value === '') continue;
        params.append(key, String(value));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

/**
 * Centralized fetch wrapper for the Good Taste API. React Native's fetch has no
 * cookie jar, so the Better Auth session cookie must be attached manually on
 * every request (see authClient.getCookie()).
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { query, body, headers, ...rest } = options;

    const url = `${ENV.API_URL}${path}${buildQueryString(query)}`;
    const cookie = authClient.getCookie();
    let response: Response;
    try {
        response = await fetch(url, {
            ...rest,
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookie,
                ...headers,
            },
            credentials: 'omit',
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError('Network request failed. Check your connection and try again.', 0);
    }

    const json = await response.json().catch(() => null);

    if (!response.ok || !json?.success) {
        throw new ApiError(json?.message ?? 'Something went wrong. Please try again.', response.status);
    }

    return json as T;
}
