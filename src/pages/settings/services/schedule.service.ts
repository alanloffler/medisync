import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';

// TODO: get this data from database

export class ScheduleService {
  // private static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

  public static async findAllSlotDuration(): Promise<number[]> {
    return [15, 30, 45, 60];
  }

  public static async findAllWorkingDays(): Promise<IWorkingDay[]> {
    return [
      { day: 0, value: false },
      { day: 1, value: false },
      { day: 2, value: false },
      { day: 3, value: false },
      { day: 4, value: false },
      { day: 5, value: false },
    ];
  }
}
