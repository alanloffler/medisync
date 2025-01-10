import type { ITableManager } from '@core/interfaces/table.interface';
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import { userSchema } from '@users/schemas/user.schema';
import { z } from 'zod';

export interface IUpdateUserVars {
  id: string;
  data: z.infer<typeof userSchema>;
}

export interface IPaginatedUsersVars {
  search: IUserSearch;
  skipItems: number;
  tableManager: ITableManager;
}
