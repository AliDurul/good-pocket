import { userKeys } from '@/api/queries/users';
import { queryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { confirmScan } from './stubs';
import type { ScanConfirmation, ScanPayload } from './types';

/**
 * Confirms a scanned delivery and returns what the customer earned.
 *
 * Backed by `stubs.ts` until the endpoint exists; swapping in `apiFetch` there needs
 * no change here. Rejections carry a `ScanError` — read the code with `scanErrorCode`
 * rather than matching on the message.
 */
export function useConfirmScan() {
  return useMutation<ScanConfirmation, unknown, ScanPayload>({
    mutationFn: (payload) => confirmScan(payload),
    onSuccess: () => {
      // The balance moved, so anything reading the customer's card is now stale —
      // most visibly the home screen's `useMyCardInfo()`.
      void queryClient.invalidateQueries({ queryKey: userKeys.details() });
    },
  });
}
