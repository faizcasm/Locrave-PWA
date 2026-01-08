import { useState, useCallback } from 'react';

interface UseOptimisticUpdateOptions<T> {
  onUpdate: (data: T) => Promise<void>;
  onError?: (error: Error) => void;
}

export const useOptimisticUpdate = <T>({
  onUpdate,
  onError,
}: UseOptimisticUpdateOptions<T>) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(
    async (data: T, optimisticUpdate: () => void, rollback: () => void) => {
      if (isUpdating) return;

      setIsUpdating(true);

      // Apply optimistic update immediately
      optimisticUpdate();

      try {
        // Perform actual update
        await onUpdate(data);
      } catch (error) {
        // Rollback on error
        rollback();
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, onUpdate, onError]
  );

  return { update, isUpdating };
};
