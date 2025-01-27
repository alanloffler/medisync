// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { useTranslation } from 'react-i18next';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
// Imports
import { AREA_CODE } from '@config/area-code.config';
// Interface
interface IProps {
  setArea: Dispatch<SetStateAction<string>>;
}
// React component
export function SelectPhoneArea({ setArea }: IProps) {
  const { i18n } = useTranslation();
  const selectedLanguage: string | undefined = i18n.resolvedLanguage;
  const [selectedCountry, setSelectedCountry] = useState(AREA_CODE.find((area) => area.lang === selectedLanguage));

  function onValueChange(e: string): void {
    setSelectedCountry(AREA_CODE.find((area) => area.code === e));
  }

  useEffect(() => {
    if (selectedCountry) setArea(selectedCountry.code);
  }, [selectedCountry, setArea]);

  return (
    <Select value={selectedCountry?.code} onValueChange={onValueChange}>
      <SelectTrigger className='h-9 w-[55px] bg-input p-2 text-xs hover:bg-input-hover'>
        <SelectValue>
          <img
            width={18}
            height={18}
            src={new URL(`../../../assets/icons/i18n/${selectedCountry?.icon}.svg`, import.meta.url).href}
            alt={selectedCountry?.label}
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
  );
}
