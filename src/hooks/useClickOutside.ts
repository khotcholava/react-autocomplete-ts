import { RefObject, useCallback, useEffect } from 'react';

type Handler = (event: MouseEvent) => void

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  cb: Handler,
): void {
  const handleClick = useCallback((e: MouseEvent) => {
    if (!ref?.current?.contains(e.target as Node)) {
      cb(e);
    }
  }, [ cb, ref ]);
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}
