// App components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
// App
import { APP_CONFIG } from '@/config/app.config';
import { IInfoCard } from '@/core/components/common/interfaces/infocard.interface';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IResponse } from '@/core/interfaces/response.interface';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/core/components/common/PageHeader';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';
// React component
export default function ViewProfessional() {
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // prettier-ignore
      ProfessionalApiService
      .findOne(id)
      .then((response: IResponse) => {
        console.log(response);
        if (response.statusCode === 200) {
          setProfessional(response.data);
        }
        if (response.statusCode > 399) {
          setInfoCard({ text: response.message, type: 'warning' });
          setIsError(true);
        }
        if (response instanceof Error) {
          setInfoCard({ text: APP_CONFIG.error.server, type: 'error' });
          setIsError(true);
        }
      })
      .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    
          <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={PV_CONFIG.title} breadcrumb={PV_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {PV_CONFIG.button.back}
        </Button>
      </div>
      {isLoading ? (
        <LoadingDB text={APP_CONFIG.loadingDB.findOneProfessional} />
      ) : isError ? (
        <InfoCard text={infoCard.text} type={infoCard.type} />
      ) : (
        <>
          <div>ViewProfessional {id}</div>
          <div>{capitalize(professional.lastName)}</div>
        </>
      )}
    </main>
  );
}
