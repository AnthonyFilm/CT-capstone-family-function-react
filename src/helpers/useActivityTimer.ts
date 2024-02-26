import { useEffect, useRef } from 'react';

export function useActivityTimer(onTimeout: () => void, timeout: number) {
  if (onTimeout === null) return null
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(onTimeout, timeout);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [onTimeout, timeout]);
}