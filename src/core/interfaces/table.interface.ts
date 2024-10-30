import type { PaginationState, SortingState } from '@tanstack/react-table';

export interface IDataTable {
  help?: boolean;
  reload: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export interface IDataTableProfessionals extends IDataTable {
  search: { value: string; type: string };
}

export interface IDataTableUsers extends IDataTable {
  search: { value: string; type: string };
}

export interface ITableManager {
  pagination: PaginationState;
  sorting: SortingState;
}
