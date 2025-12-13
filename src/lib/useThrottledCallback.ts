import { throttle, type DebouncedFunc } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export function useThrottledCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): DebouncedFunc<T> {
    const callbackRef = useRef(callback);
    
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);
  
    const throttledFn = useMemo(
      () => throttle((...args: Parameters<T>) => callbackRef.current(...args), delay),
      [delay]
    );
  
    useEffect(() => {
      return () => throttledFn.cancel?.();
    }, [throttledFn]);
  
    return throttledFn;
  }