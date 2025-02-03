// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { type ComponentPropsWithoutRef, type Dispatch, forwardRef, type SetStateAction, useEffect, useState } from 'react';
// Imports
import { AREA_CODE } from '@config/area-code.config';
// Interface
interface IProps extends ComponentPropsWithoutRef<'div'> {
  setArea?: Dispatch<SetStateAction<number | undefined>>;
  value: number;
}

interface IAreaCode {
  id: number;
  code: string;
  abbreviation: string;
  icon: string;
  label: string;
  lang: string;
  default?: boolean;
}
// React component
export const SelectPhoneArea = forwardRef<HTMLDivElement, IProps>(({ setArea, value, ...props }, ref) => {
  const [areaCode, setAreaCode] = useState<IAreaCode | undefined>();

  useEffect(() => {
    if (isNaN(value)) {
      // setAreaCode(AREA_CODE[0]);
      setAreaCode(undefined);
      if (setArea) setArea(Number(AREA_CODE[0].code));
    } else {
      setAreaCode(AREA_CODE.find((area: IAreaCode) => area.code === String(value)));
    }
  }, [setArea, value]);

  function onValueChange(e: string): void {
    const areaCode: IAreaCode = AREA_CODE.find((area: IAreaCode) => area.code === e) ?? AREA_CODE[0];
    setAreaCode(areaCode);
    if (setArea) setArea(Number(e));
  }

  return (
    <div ref={ref} {...props}>
      <Select value={areaCode?.code} onValueChange={onValueChange}>
        <SelectTrigger className='h-9 bg-slate-100/70 p-2 text-xs ring-offset-background hover:bg-slate-100 data-[state=open]:outline-none data-[state=open]:ring-1 data-[state=open]:ring-ring data-[state=open]:ring-offset-0'>
          {areaCode ? (
            <SelectValue>
              <section className='mr-1 flex flex-row items-center gap-1'>
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
            <div className='min-w-[25px]'></div>
          )}
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} className='min-w-0' align='end'>
          <SelectGroup>
            {AREA_CODE.map((area) => (
              <SelectItem key={crypto.randomUUID()} value={area.code}>
                <div className='flex flex-row items-center space-x-2'>
                  <img width={18} height={18} src={new URL(`../../../assets/icons/i18n/${area.icon}.svg`, import.meta.url).href} alt={area.label} />
                  <div className='text-xs'>{area.abbreviation}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});
