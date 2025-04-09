import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import type { IError } from '@core/interfaces/error.interface';
import type { IResponse } from '@core/interfaces/response.interface';

export interface IStatistic {
  children: ReactNode;
  error?: AxiosError<IError> | null;
  isLoading?: boolean;
  item: IStatisticItem;
  value1?: string;
  value2?: string;
}

export interface IStatisticItem {
  _id: number;
  content: string;
  path: string;
  title: string;
}

export interface IStatisticChart {
  fetchChartData: (days: number) => Promise<IResponse>;
  height?: number;
  labels?: IChartLabels;
  margin?: IChartMargin;
  options?: any;
  path?: string;
  title?: string;
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

interface IChartLabels {
  x: string;
  y: string;
}

export interface IChartDays {
  text: string;
  value: number;
  default?: boolean;
}
