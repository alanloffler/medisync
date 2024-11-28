import type { Dispatch, SetStateAction } from 'react';
import type { IUser } from '@users/interfaces/user.interface';
import type { PaginationState, Table as ITable } from '@tanstack/react-table';

export interface IPagination {
  className?: string;
  help?: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  table: ITable<IUser>;
}
