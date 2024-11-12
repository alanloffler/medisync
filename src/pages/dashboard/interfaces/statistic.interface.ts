import type { ReactNode } from 'react';

export interface IStatistic {
  children: ReactNode;
  content: string;
  error?: Error | null;
  isLoading?: boolean;
  path?: string;
  title: string;
  value1?: string;
  value2?: string;
}
