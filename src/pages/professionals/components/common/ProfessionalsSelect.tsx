// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { cn } from '@lib/utils';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface and type
interface IProps {
  className?: string;
  day?: string;
  hour?: string;
  defaultValue?: string;
  label?: string;
  onValueChange?: (e: string) => void;
  placeholder?: string;
  service: TService;
}

type TService = 'active' | 'replace';
// React component
export function ProfessionalsSelect({ className, day, hour, defaultValue, label, onValueChange, placeholder, service }: IProps) {
  const { t } = useTranslation();
  const addNotification = useNotificationsStore((state) => state.addNotification);

  const {
    data: professionals,
    error,
    isError,
    isPending,
  } = useQuery<IResponse<IProfessional[]>, Error>({
    queryKey: ['professionals', 'input-select', service, day, hour],
    queryFn: async () => {
      if (service === 'active') return await ProfessionalApiService.findAllActive();
      if (service === 'replace' && day && hour) return await ProfessionalApiService.findAllAvailableForChange(day, hour);
      return await ProfessionalApiService.findAllActive();
    },
  });

  useEffect(() => {
    if (isError) addNotification({ type: 'error', message: error?.message });
  }, [addNotification, error?.message, isError]);

  return (
    <main className='flex flex-row items-center space-x-3'>
      {label && <span className='text-xsm font-medium text-muted-foreground'>{label}</span>}
      <Select defaultValue={defaultValue} onValueChange={onValueChange} disabled={isError}>
        <SelectTrigger className={cn('h-7 w-full space-x-3 bg-input text-xsm', className)}>
          {isError ? (
            <InfoCard type='error' text={t('error.default')} className='mx-auto' />
          ) : isPending ? (
            <LoadingDB size='xs' text={t('loading.default')} />
          ) : (
            placeholder && <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {professionals?.data &&
              professionals?.data.map((professional) => (
                <SelectItem key={crypto.randomUUID()} value={professional._id} className='text-xsm'>
                  {UtilsString.upperCase(`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`, 'each')}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
