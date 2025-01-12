// External imports
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// React hook
export function useReserveFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const professional: string = searchParams.get('p') as string;

  const setFilters = useCallback((filters: any) => {
    setSearchParams((params) => {
      if (filters.professional !== undefined) params.set('p', filters.professional);

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = useCallback((filters: any) => {
    setSearchParams((params) => {
      if (filters.professional !== undefined) params.delete('p');

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    professional,
    setFilters,
    clearFilters,
  };
}
