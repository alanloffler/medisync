export interface IStatistic {
  count: IStatisticElement;
  diff?: number;
  last: IStatisticElement;
}

interface IStatisticElement {
  label: string;
  value: number;
}
