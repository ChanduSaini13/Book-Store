import { useState, useCallback } from 'react';
import { showToast } from '../utils/toast.js';

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, isLoading: false });
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An error occurred');
      setState({ data: null, error: err, isLoading: false });
      showToast(err.message, 'error');
      throw err;
    }
  }, [asyncFunction]);

  if (immediate) {
    execute();
  }

  return { ...state, execute };
};
