import type { IProfessionalSearch } from '@professionals/interfaces/professional-search.interface';
import type { ITableManager } from '@core/interfaces/table.interface';

export interface IPaginatedProfessionalsVars {
  search: IProfessionalSearch;
  skipItems: number;
  tableManager: ITableManager;
}
