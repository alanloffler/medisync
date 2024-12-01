// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { cn } from '@lib/utils';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IAvailableProfessional {
  className?: string;
  data: Partial<IProfessional>;
  help: boolean;
  items: { id: number; label: string; value: boolean }[];
}
// React component
export function AvailableProfessional({ className, data, help, items }: IAvailableProfessional) {
  const { _id, available } = data;
  const [prevValue, setPrevValue] = useState<string>(String(available));
  const [showError, setShowError] = useState<boolean>(false);
  const [value, setValue] = useState<string>(String(available));
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation();

  const { mutateAsync: updateAvailability, isError } = useMutation<IResponse, Error, string>({
    mutationFn: async (value: string) => await ProfessionalApiService.updateAvailability(_id as string, value),
    onSuccess: (response, value) => {
      setPrevValue(value);
      addNotification({ type: 'success', message: response.message });
    },
    onError: (error) => {
      setValue(prevValue);
      setShowError(true);
      addNotification({ type: 'error', message: error.message });

      const interval = setInterval(() => {
        setShowError(false);
        clearInterval(interval);
      }, 3000);
    },
  });

  function handleValueChange(newValue: string): void {
    setValue(newValue);
    updateAvailability(newValue);
  }

  return (
    <main className='flex flex-row items-center space-x-1'>
      <Select value={value} onValueChange={handleValueChange}>
        <TooltipWrapper tooltip={t('tooltip.availability')} help={help}>
          <SelectTrigger className={cn('h-8 w-fit space-x-2 bg-transparent px-2 py-1 text-xs hover:bg-input', className)}>
            <SelectValue placeholder='Select a fruit' />
          </SelectTrigger>
        </TooltipWrapper>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <SelectGroup>
            <SelectItem value={items ? items[0].value.toString() : 'true'} className='px-2 py-1 text-xs focus:bg-input [&_svg]:hidden'>
              <div className='flex items-center space-x-2'>
                <div className='h-2.5 w-2.5 rounded-full bg-emerald-400'></div>
                <span>{items ? items[0].label : 'Active'}</span>
              </div>
            </SelectItem>
            <SelectItem value={items ? items[1].value.toString() : 'false'} className='px-2 py-1 text-xs focus:bg-input [&_svg]:hidden'>
              <div className='flex items-center space-x-2'>
                <div className='h-2.5 w-2.5 rounded-full bg-rose-400'></div>
                <span>{items ? items[1].label : 'Inactive'}</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {isError && showError && <span className='text-xs text-rose-400'>{t('error.default')}</span>}
    </main>
  );
}
