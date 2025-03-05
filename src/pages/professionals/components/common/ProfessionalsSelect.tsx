// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect, useState } from 'react';
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
  defaultValue?: string;
  hour?: string;
  label?: string;
  onValueChange?: (professional: IProfessional) => void;
  placeholder?: string;
  service: TService;
}
type TService = 'active' | 'replace';
// React component
export function ProfessionalsSelect({ className, day, hour, defaultValue, label, onValueChange, placeholder, service }: IProps) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | undefined>(defaultValue);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation();

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

  function handleProfessionalChange(id: string): void {
    setSelectedProfessionalId(id);
    if (onValueChange && professionals?.data) {
      const selectedProfessional = professionals.data.find((prof) => prof._id === id);
      if (selectedProfessional) onValueChange(selectedProfessional);
    }
  }

  useEffect(() => {
    if (isError) addNotification({ type: 'error', message: error?.message });
  }, [addNotification, error?.message, isError]);

  useEffect(() => {
    if (defaultValue && professionals?.data && onValueChange) {
      const defaultProfessional = professionals.data.find((prof) => prof._id === defaultValue);
      if (defaultProfessional) {
        onValueChange(defaultProfessional);
      }
    }
  }, [defaultValue, professionals?.data, onValueChange]);

  return (
    <main className='flex flex-row items-center space-x-3'>
      {label && <span className='text-xsm font-medium text-muted-foreground'>{label}</span>}
      <Select defaultValue={defaultValue} value={selectedProfessionalId} onValueChange={handleProfessionalChange} disabled={isError}>
        <SelectTrigger className={cn('h-7 w-full space-x-3 bg-input text-xsm', className)}>
          {isError ? (
            <InfoCard size='xs' text={t('error.default')} type='flat-colored' variant='error' />
          ) : isPending ? (
            <LoadingDB className='!mx-0 !justify-start' iconSize={14} size='xs' text={t('loading.default')} />
          ) : (
            placeholder && <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {professionals?.data &&
              professionals?.data.map((professional) => (
                <SelectItem key={professional._id} value={professional._id} className='text-xsm'>
                  {UtilsString.upperCase(`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`, 'each')}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
