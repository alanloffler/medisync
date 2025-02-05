// TODO: get this data from database

export interface IProfTitle {
  id: string;
  abbreviation: string;
  title: string;
}

export class ScheduleService {
  // private static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

  public static async findAllSlotDurations(): Promise<number[]> {
    // throw new Error('Can\'t fetch slot duration values');
    return [15, 30, 45, 60];
  }
}
