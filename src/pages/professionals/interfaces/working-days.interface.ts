export interface IWorkingDay {
  day: number;
  value: boolean;
}

export interface IWorkingDaysProps {
  data?: IWorkingDay[] | undefined;
  handleWorkingDaysValues: (data: IWorkingDay[]) => void;
  label: string;
}
