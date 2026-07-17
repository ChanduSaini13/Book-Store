import { useState, useEffect } from 'react';
import { debounce as debounceUtil } from '../utils/helpers.js';

export const useDebounce = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounceUtil(() => {
      setDebouncedValue(value);
    }, delay);

    handler();

    return () => {
      clearTimeout(handler as any);
    };
  }, [value, delay]);

  return debouncedValue;
};
