import { PaginationState, SortingState } from '@tanstack/react-table';

export interface IDataTable {
  help: boolean;
  reload: number;
  search: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export interface ITableManager {
  pagination: PaginationState;
  sorting: SortingState;
}
