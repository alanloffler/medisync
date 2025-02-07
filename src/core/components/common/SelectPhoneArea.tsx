// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { FormError } from '@core/components/common/form/FormError';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { type ComponentPropsWithoutRef, type Dispatch, forwardRef, type SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IAreaCode } from '@core/interfaces/area-code.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AreaCodeService } from '@core/services/area-code.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IProps extends ComponentPropsWithoutRef<'div'> {
  setArea?: Dispatch<SetStateAction<number | undefined>>;
  value: number;
}
// React component
export const SelectPhoneArea = forwardRef<HTMLDivElement, IProps>(({ setArea, value, ...props }, ref) => {
  const [areaCode, setAreaCode] = useState<IAreaCode | undefined>();
  const addNotification = useNotificationsStore((state) => state.addNotification);

  const {
    data: areaCodes,
    error: areaCodesError,
    isError: areaCodesIsError,
    isLoading: areaCodesIsLoading,
  } = useQuery<IResponse<IAreaCode[]>, Error>({
    queryKey: ['area-codes', 'find-all'],
    queryFn: async () => await AreaCodeService.findAll(),
  });

  useEffect(() => {
    if (areaCodesIsError) addNotification({ type: 'error', message: areaCodesError?.message });
  }, [addNotification, areaCodesError?.message, areaCodesIsError]);

  useEffect(() => {
    if (isNaN(value)) {
      setAreaCode(undefined);
      if (setArea) setArea(Number(areaCodes?.data[0].code));
    } else {
      setAreaCode(areaCodes?.data.find((area: IAreaCode) => area.code === String(value)));
    }
  }, [areaCodes?.data, setArea, value]);

  function onValueChange(e: string): void {
    const areaCode: IAreaCode | undefined = areaCodes?.data.find((area: IAreaCode) => area.code === e) ?? areaCodes?.data[0];
    if (areaCode) setAreaCode(areaCode);
    if (setArea) setArea(Number(e));
  }

  return (
    <div ref={ref} {...props}>
      <Select value={areaCode?.code} onValueChange={onValueChange}>
        <div className='flex items-center space-x-3'>
          <SelectTrigger
            className='h-9 bg-slate-100/70 p-2 text-xs ring-offset-background hover:bg-slate-100 data-[state=open]:outline-none data-[state=open]:ring-1 data-[state=open]:ring-ring data-[state=open]:ring-offset-0'
            disabled={!areaCodes || areaCodesIsError}
          >
            {areaCodesIsLoading ? <LoadingDB empty className='mr-2 h-3.5 w-3.5' /> : areaCode ? (
              <SelectValue>
                <section className='mr-2 flex flex-row items-center gap-2'>
                  <img
                    width={18}
                    height={18}
                    src={new URL(`../../../assets/icons/i18n/${areaCode?.icon}.svg`, import.meta.url).href}
                    alt={areaCode?.label}
                  />
                  <div>{areaCode?.code}</div>
                </section>
              </SelectValue>
            ) : (
              <div className='min-w-[35px]'></div>
            )}
          </SelectTrigger>
          {areaCodesIsError && <FormError message={areaCodesError?.message} />}
        </div>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} className='min-w-0' align='end'>
          <SelectGroup>
            {areaCodes?.data &&
              areaCodes?.data.map(
                (area) =>
                  area.code.length >= 1 && (
                    <SelectItem key={crypto.randomUUID()} value={area.code}>
                      <div className='flex flex-row items-center space-x-2'>
                        <img
                          width={18}
                          height={18}
                          src={new URL(`../../../assets/icons/i18n/${area.icon}.svg`, import.meta.url).href}
                          alt={area.label}
                        />
                        <div className='text-xs'>{area.abbreviation}</div>
                      </div>
                    </SelectItem>
                  ),
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});
