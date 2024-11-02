import type { ReactNode } from 'react';

export interface IStatistic {
  children: ReactNode;
  content: string;
  title: string;
  value: string;
}
