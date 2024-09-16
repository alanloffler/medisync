// TODO: get this data from database

export interface IProfTitle {
  id: string;
  abbreviation: string;
  title: string;
}

export class ScheduleService {
  // private static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

  public static async findAllProfessionalTitles(): Promise<IProfTitle[]> {
    return [
      { id: '1', abbreviation: 'Bioq.', title: 'Bioquímica' },
      { id: '2', abbreviation: 'Bioq.', title: 'Bioquímico' },
      { id: '3', abbreviation: 'Dr.', title: 'Doctor' },
      { id: '4', abbreviation: 'Dra.', title: 'Doctora' },
      { id: '5', abbreviation: 'Lic.', title: 'Licenciada' },
      { id: '6', abbreviation: 'Lic.', title: 'Licenciado' },
      { id: '7', abbreviation: 'Téc.', title: 'Técnica' },
      { id: '8', abbreviation: 'Téc.', title: 'Técnico' },
    ];
  }

  public static async findAllSlotDurations(): Promise<number[]> {
    return [15, 30, 45, 60];
  }
}
