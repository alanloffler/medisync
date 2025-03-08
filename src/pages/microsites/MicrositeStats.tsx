// External imports
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { StatisticsService } from './services/statistics.service';
// Interface
interface IProps {
  professionalId?: string;
}
// React component
export function MicrositeStats({ professionalId }: IProps) {
  console.log('Professional ID:', professionalId);

  const { data } = useQuery<IResponse<any>, Error>({
    queryKey: ['micrositeStats', professionalId],
    queryFn: async () => {
      if (!professionalId) throw new Error('Professional ID is required');
      return await StatisticsService.countApposByProfessional(professionalId);
    },
  });

  return (
    <main className='flex flex-col gap-3 text-sm'>
      <h1 className='text-xs font-semibold uppercase text-muted-foreground'>Estadísticas</h1>
      <section>Stats here {data?.data}</section>
    </main>
  );
}
