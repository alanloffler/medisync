// External imports
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// Imports
import type { IApposFilters } from '@appointments/interfaces/appos-filters.interface';
// React hook
export function useApposFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const month = searchParams.get('m') as IApposFilters['month'];
  const page = searchParams.get('pg') as IApposFilters['page'];
  const professional: IApposFilters['professional'] = searchParams.get('p') as IApposFilters['professional'];
  const year = searchParams.get('y') as IApposFilters['year'];

  const setFilters = useCallback((filters: IApposFilters) => {
    setSearchParams((params) => {
      if (filters.month !== undefined) params.set('m', filters.month);
      if (filters.page !== undefined) params.set('pg', filters.page);
      if (filters.professional !== undefined) params.set('p', filters.professional);
      if (filters.year !== undefined) params.set('y', filters.year);

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = useCallback((filters: Partial<IApposFilters>) => {
    setSearchParams((params) => {
      if (filters.month !== undefined) params.delete('m');
      if (filters.page !== undefined) params.delete('pg');
      if (filters.professional !== undefined) params.delete('p');
      if (filters.year !== undefined) params.delete('y');

      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    month,
    page,
    professional,
    year,
    setFilters,
    clearFilters,
  };
}
