import { useRef, useCallback, useEffect, useState } from 'react';
import { useThrottledCallback } from '@mantine/hooks';

export function useThrottledUpdate<T>(
  wait: number,
  updateFn: (updates: T[]) => Promise<void>
) {
  const [isError, setIsError] = useState(false);
  const isPendingRef = useRef(false);
  const valueRef = useRef<T[]>([]);

  const doUpdate = useCallback(
    (forced: boolean) => {
      if (!forced && isPendingRef.current) {
        return;
      }

      const updateValues = valueRef.current;
      valueRef.current = [];

      if (updateValues.length === 0) {
        return;
      }

      isPendingRef.current = true;
      updateFn(updateValues)
        .then(() => {
          setIsError(false);
        })
        .catch(() => {
          setIsError(true);
          valueRef.current = [...updateValues, ...valueRef.current];
        })
        .finally(() => {
          isPendingRef.current = false;
        });
    },
    [isPendingRef, valueRef, updateFn, setIsError]
  );

  useEffect(() => {
    return () => doUpdate(true);
  }, [doUpdate]);

  const tryUpdate = useThrottledCallback(doUpdate, wait);

  const addUpdate = useCallback(
    (value: T) => {
      valueRef.current.push(value);
      tryUpdate(false);
    },
    [valueRef, tryUpdate]
  );

  return { addUpdate, flush: doUpdate, isError };
}
