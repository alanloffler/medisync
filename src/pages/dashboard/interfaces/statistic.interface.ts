import type { ReactNode } from 'react';

export interface IStatistic {
  children: ReactNode;
  content: string;
  isLoading?: boolean;
  title: string;
  value1?: string;
  value2?: string;
}
