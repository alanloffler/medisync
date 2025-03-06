// Icons: https://lucide.dev/icons
import { Package2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
// External imports
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { LoadingDB } from '@core/components/common/LoadingDB';
// React component
export default function ProfessionalMicrosite() {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    data: professional,
    error: profError,
    isError: profIsError,
    isLoading: profIsLoading,
    isSuccess: profIsSuccess,
  } = useQuery<IResponse<IProfessional>, Error>({
    queryKey: ['professional', id],
    queryFn: async () => {
      if (!id) throw new Error('Dev Error: No ID provided');
      return await ProfessionalApiService.findOne(id);
    },
  });

  if (profIsLoading)
    return (
      <main className='flex h-screen flex-col bg-muted/70'>
        <LoadingDB absolute size='default' text={t('loading.professional')} variant='card' />
      </main>
    );

  if (profIsError)
    return (
      <main className='flex h-screen flex-col bg-muted/70'>
        <InfoCard className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' text={profError.message} variant='error' />
      </main>
    );

  if (profIsSuccess)
    return (
      <main className='flex h-screen flex-col bg-muted/70'>
        <header className='sticky top-0 z-50 flex h-16 items-center justify-between gap-4 bg-background px-4 shadow-sm md:justify-normal md:gap-8 md:px-8'>
          <div className='flex items-center gap-2 font-semibold md:text-base'>
            <Package2 size={24} strokeWidth={2} />
            <span>{t('appName')}</span>
          </div>
          <h1 className='text-base font-medium text-foreground'>
            {UtilsString.upperCase(`${professional?.data.title.abbreviation} ${professional?.data.firstName} ${professional?.data.lastName}`, 'each')}
          </h1>
        </header>
        <section className='flex flex-col gap-6 p-6 md:gap-8 md:p-8'>
          <Card className='p-4'>Statistics here</Card>
        </section>
      </main>
    );
}
