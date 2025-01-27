// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
// Imports
import { AREA_CODE } from '@config/area-code.config';
// Interface
interface IProps {
  setArea: Dispatch<SetStateAction<number | undefined>>;
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
export function SelectPhoneArea({ setArea, value }: IProps) {
  const [areaCode, setAreaCode] = useState<IAreaCode | undefined>();

  useEffect(() => {
    if (isNaN(value)) {
      setAreaCode(AREA_CODE[0]);
      setArea(Number(AREA_CODE[0].code));
    } else {
      setAreaCode(AREA_CODE.find((area: IAreaCode) => area.code === String(value)));
    }
  }, [value, setArea]);

  function onValueChange(e: string): void {
    const areaCode: IAreaCode = AREA_CODE.find((area: IAreaCode) => area.code === e) ?? AREA_CODE[0];
    setAreaCode(areaCode);
    setArea(Number(e));
  }

  return (
    <>
      <Select value={areaCode?.code} onValueChange={onValueChange}>
        <SelectTrigger className='h-9 w-[55px] bg-input p-2 text-xs hover:bg-input-hover'>
          <SelectValue>
            <img
              width={18}
              height={18}
              src={new URL(`../../../assets/icons/i18n/${areaCode?.icon}.svg`, import.meta.url).href}
              alt={areaCode?.label}
              className='mr-2'
            />
          </SelectValue>
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
    </>
  );
}
