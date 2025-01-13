// External imports
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// Interface
interface IApposFilters {
  dateParam?: string;
  professionalParam?: string;
}
// React hook
export function useReserveFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const professionalParam = searchParams.get('p') as IApposFilters['professionalParam'];
  const dateParam = searchParams.get('d') as IApposFilters['dateParam'];

  const setFilters = useCallback((filters: IApposFilters) => {
    setSearchParams((params) => {
      if (filters.professionalParam !== undefined) params.set('p', filters.professionalParam);
      if (filters.dateParam !== undefined) params.set('d', filters.dateParam);

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = useCallback((filters: Partial<IApposFilters>) => {
    setSearchParams((params) => {
      if (filters.professionalParam !== undefined) params.delete('p');
      if (filters.dateParam !== undefined) params.delete('d');

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dateParam,
    professionalParam,
    setFilters,
    clearFilters,
  };
}
