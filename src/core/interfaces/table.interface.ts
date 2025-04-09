import type { IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import type { IProfessionalSearch } from '@professionals/interfaces/professional-search.interface';
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import type { PaginationState, SortingState } from '@tanstack/react-table';

export interface IDataTable {
  reload?: string;
  setReload?: React.Dispatch<React.SetStateAction<string>>;
}

export interface IDataTableAppointments extends IDataTable {
  search: IAppointmentSearch[];
}

export interface IDataTableProfessionals extends IDataTable {
  clearDropdown: () => void;
  search: IProfessionalSearch;
}

export interface IDataTableUsers extends IDataTable {
  search: IUserSearch;
  setSearch: React.Dispatch<React.SetStateAction<IUserSearch>>;
}

export interface ITableManager {
  pagination: PaginationState;
  sorting: SortingState;
}
