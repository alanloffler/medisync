// External imports
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// Interface
interface IApposFilters {
  professional: string;
}
// React hook
export function useReserveFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const professional = searchParams.get('p') as IApposFilters['professional'];
  // const date = searchParams.get('d') as IApposFilters['date'];

  const setFilters = useCallback((filters: IApposFilters) => {
    setSearchParams((params) => {
      if (filters.professional !== undefined) params.set('p', filters.professional);
      // if (filters.date !== undefined) params.set('d', filters.date);

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = useCallback((filters: Partial<IApposFilters>) => {
    setSearchParams((params) => {
      if (filters.professional !== undefined) params.delete('p');
      // if (filters.date !== undefined) params.delete('d');

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // date,
    professional,
    setFilters,
    clearFilters,
  };
}
