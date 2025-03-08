// External imports
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStats } from '@microsites/interfaces/statistics.interface';
import { StatisticsService } from '@microsites/services/statistics.service';
// Interface
interface IProps {
  professionalId?: string;
}
// React component
export function MicrositeStats({ professionalId }: IProps) {
  console.log('Professional ID:', professionalId);

  const { data: countAppos } = useQuery<IResponse<IStats>, Error>({
    queryKey: ['micrositeStats', professionalId],
    queryFn: async () => {
      if (!professionalId) throw new Error('Professional ID is required');
      return await StatisticsService.countApposByProfessional(professionalId);
    },
  });

  return (
    <main className='flex flex-col gap-3 text-sm'>
      <h1 className='text-xs font-semibold uppercase text-muted-foreground'>Estadísticas</h1>
      <section className='flex flex-col'>
        <span>{countAppos?.data.total} turnos en total</span>
        <span>{countAppos?.data.attended} atendidos</span>
        <span>{countAppos?.data.notAttended} no atendidos</span>
      </section>
    </main>
  );
}
