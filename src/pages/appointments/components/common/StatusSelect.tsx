// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@core/components/ui/select';
// Components
import { Dot } from '@core/components/common/ui/Dot';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { isAfter, parse } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EStatus } from '@appointments/enums/status.enum';
import { cn } from '@lib/utils';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interfaces
interface IStatusSelect {
  appointment: IAppointment;
  className?: string;
  mode: 'update' | 'view';
  showLabel?: boolean;
}

interface IStatusOption {
  label: string;
  value: string;
}
// Constants
const statusOptions: IStatusOption[] = [
  {
    value: EStatus.ATTENDED,
    label: `status.${EStatus.ATTENDED}`,
  },
  {
    value: EStatus.NOT_ATTENDED,
    label: `status.${EStatus.NOT_ATTENDED}`,
  },
  {
    value: EStatus.NOT_STATUS,
    label: `status.${EStatus.NOT_STATUS}`,
  },
  {
    value: EStatus.WAITING,
    label: `status.${EStatus.WAITING}`,
  },
];
// React component
export function StatusSelect({ appointment, className, mode, showLabel = false }: IStatusSelect) {
  const [itemSelected, setItemSelected] = useState<string>(appointment.status);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { day, hour, _id, status } = appointment;
  const { t } = useTranslation();

  useEffect(() => {
    const futureDate: boolean = isAfter(parse(`${day}T${hour}`, 'YYYY-MM-DDTHH:mm'), new Date());
    futureDate ? setItemSelected(EStatus.WAITING) : setItemSelected(status);
  }, [day, hour, status]);

  const { mutate } = useMutation<IResponse, Error, { status: string }>({
    mutationKey: ['appointment', 'update', _id, status],
    mutationFn: async () => {
      return await AppointmentApiService.update(_id, itemSelected);
    },
    onSuccess: (success, vars) => {
      setItemSelected(vars.status);
      addNotification({ type: 'success', message: success.message });
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error?.message });
    },
  });

  function handleStatusChange(status: string): void {
    if (mode === 'update') {
      setItemSelected(status);
      mutate({ status });
    }
  }

  return (
    <Select value={itemSelected} onValueChange={handleStatusChange} disabled={itemSelected === EStatus.WAITING || mode === 'view'}>
      <TooltipWrapper tooltip={t(`status.${itemSelected}`)}>
        <SelectTrigger
          className={cn('flex flex-row items-center justify-center space-x-1 bg-transparent p-0 disabled:cursor-default [&_svg]:hidden', className)}
        >
          <Dot
            color={
              itemSelected === EStatus.ATTENDED
                ? 'green'
                : itemSelected === EStatus.NOT_ATTENDED
                  ? 'red'
                  : itemSelected === EStatus.WAITING
                    ? 'yellow'
                    : 'slate'
            }
            size={16}
          />
          {showLabel && <section>{t(`status.${itemSelected}`)}</section>}
        </SelectTrigger>
      </TooltipWrapper>
      <SelectContent align='center' onCloseAutoFocus={(e) => e.preventDefault()}>
        <SelectGroup>
          {statusOptions
            .filter((item) => item.value !== EStatus.WAITING)
            .map((option) => (
              <SelectItem key={crypto.randomUUID()} value={option.value} className='[&_svg]:h-3 [&_svg]:w-3'>
                <div className='flex flex-row items-center space-x-2'>
                  <Dot
                    color={
                      option.value === EStatus.ATTENDED
                        ? 'green'
                        : option.value === EStatus.NOT_ATTENDED
                          ? 'red'
                          : option.value === EStatus.WAITING
                            ? 'yellow'
                            : 'slate'
                    }
                    size={14}
                  />
                  <div className='text-xs'>{t(option.label)}</div>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
