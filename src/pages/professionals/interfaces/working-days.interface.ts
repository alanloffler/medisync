export interface IWorkingDay {
  day: number;
  value: boolean;
}

export interface IWorkingDaysProps {
  data: IWorkingDay[];
  handleWorkingDaysValues: (data: IWorkingDay[]) => void;
  label: string;
}
