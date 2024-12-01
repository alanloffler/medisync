import type { Dispatch, SetStateAction } from 'react';
import type { PaginationState, Table } from '@tanstack/react-table';

export interface IPagination<TData> {
  className?: string;
  help?: boolean;
  itemsPerPage?: number[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  table: Table<TData>;
}
