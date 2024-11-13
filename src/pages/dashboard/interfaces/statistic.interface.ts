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

export interface IStatisticChart {
  title: string;
}

export interface IChartData {
  date: string;
  value: number;
}

export interface IChartDataProcessed {
  date: Date;
  value: number;
}

export interface IChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
