// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { PROFESSIONALS_SELECT_CONFIG as PS_CONFIG } from '@config/professionals/professional-select.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { cn } from '@lib/utils';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function ProfessionalsSelect({
  className,
  defaultValue,
  onValueChange,
}: {
  className?: string;
  defaultValue?: string;
  onValueChange?: (e: string) => void;
}) {
  const capitalize = useCapitalize();
  const { t } = useTranslation();

  const {
    data: professionals,
    isError,
    isPending,
  } = useQuery<IResponse<IProfessional[]>, Error>({
    queryKey: ['professionals', ['input-select']],
    queryFn: async () => await ProfessionalApiService.findAllActive(),
    retry: 1,
  });

  return (
    <main className='flex flex-row items-center space-x-2'>
      <span className='text-xsm font-medium text-slate-500'>{t(PS_CONFIG.label)}</span>
      <Select defaultValue={defaultValue} onValueChange={onValueChange} disabled={isError}>
        <SelectTrigger className={cn('h-8 w-full space-x-2 border bg-white text-xsm shadow-sm', className)}>
          {isError ? (
            <InfoCard type='error' text={t('error.default')} className='mx-auto' />
          ) : isPending ? (
            <LoadingDB size='xs' text={t('loading.default')} />
          ) : (
            <SelectValue placeholder={t(PS_CONFIG.placeholder)} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {professionals?.data &&
              professionals?.data.map((professional) => (
                <SelectItem key={crypto.randomUUID()} value={professional._id} className='text-xsm'>
                  {capitalize(professional.title.abbreviation)} {capitalize(professional.firstName)} {capitalize(professional.lastName)}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
