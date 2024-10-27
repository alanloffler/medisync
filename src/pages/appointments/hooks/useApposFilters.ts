// External imports
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// TODO: put in an interface file
export interface IApposFilters {
  professional?: string;
  year?: string;
  month?: string;
}
// React hook
export function useApposFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const professional: string | undefined = searchParams.get('p') as IApposFilters['professional'];
  const year: string | undefined = searchParams.get('y') as IApposFilters['year'];
  const month: string | undefined = searchParams.get('m') as IApposFilters['month'];

  const setFilters = useCallback((filters: IApposFilters) => {
    setSearchParams((params) => {
      if (filters.professional !== undefined) params.set('p', filters.professional);
      if (filters.year !== undefined) params.set('y', filters.year);
      if (filters.month !== undefined) params.set('m', filters.month);
      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    professional,
    year,
    month,
    setFilters,
  };
}
