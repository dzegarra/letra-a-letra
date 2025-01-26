import { useCallback, useEffect, useRef } from "react";

export const useDebounce = (callback: (...args: any[]) => any, delay: number) => {
  const handlerRef = useRef<number>();

  const debouncedCallback = useCallback(
    (...args: unknown[]) => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }
      handlerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
  // Cleanup
  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }
    };
  }, []);
  return debouncedCallback;
};
