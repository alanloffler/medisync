import { EUserSearch } from '@users/enums/user-search.enum';

export interface IUserSearch {
  type: EUserSearch;
  value: string;
}
