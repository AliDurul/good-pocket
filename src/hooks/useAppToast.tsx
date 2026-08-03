import { useCallback, useMemo, useRef } from 'react';
import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from '@/components/ui/toast';
import { HStack } from '@/components/ui/hstack';
import { HelpCircleIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';

type ToastAction = 'success' | 'error' | 'warning' | 'info';

export type ToastOptions = {
    /** Optional bold heading shown above the message. */
    title?: string;
    /** How long the toast stays visible, in ms. Defaults to 3000. */
    duration?: number;
    /** Where the toast appears. Defaults to 'top'. */
    placement?:
    | 'top'
    | 'bottom'
    | 'top right'
    | 'top left'
    | 'bottom left'
    | 'bottom right';
};

type ShowToast = (message: string, options?: ToastOptions) => string;

export type UseAppToast = {
    success: ShowToast;
    error: ShowToast;
    warning: ShowToast;
    info: ShowToast;
};

const DEFAULT_TITLE: Record<ToastAction, string> = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
};

/**
 * Typed wrapper around gluestack-ui's `useToast` so any component can fire a
 * styled toast with a single call.
 *
 * @example
 * const toast = useAppToast()
 * toast.success('Profile updated')
 * toast.error('Something went wrong', { title: 'Login failed' })
 */
export function useAppToast(): UseAppToast {
    const toast = useToast();
    const idRef = useRef(0);

    const showWithAction = useCallback(
        (action: ToastAction, message: string, options?: ToastOptions) => {
            const id = `toast-${idRef.current++}`;
            const title = options?.title ?? DEFAULT_TITLE[action];

            toast.show({
                id,
                placement: options?.placement ?? 'top',
                duration: options?.duration ?? 5000,
                render: ({ id: renderId }) => {
                    const uniqueId = `toast-${renderId}`;
                    return (
                        <Toast nativeID={uniqueId} className='' action={action} variant="solid">
                            <HStack space='md'>
                                {action === 'error' && <Icon as={HelpCircleIcon} className="text-red-500 mt-0.5" />}
                                <VStack space='xs'>
                                    {title ? <ToastTitle>{title}</ToastTitle> : null}
                                    <ToastDescription>{message}</ToastDescription>
                                </VStack>
                            </HStack>
                        </Toast>
                    );
                },
            });

            return id;
        },
        [toast]
    );

    return useMemo<UseAppToast>(
        () => ({
            success: (message, options) => showWithAction('success', message, options),
            error: (message, options) => showWithAction('error', message, options),
            warning: (message, options) => showWithAction('warning', message, options),
            info: (message, options) => showWithAction('info', message, options),
        }),
        [showWithAction]
    );
}

export default useAppToast;
