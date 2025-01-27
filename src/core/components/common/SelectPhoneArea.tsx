import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
import { useTranslation } from 'react-i18next';

import { AREA_CODE } from '@config/area-code.config';
import { useEffect, useState } from 'react';

export function SelectPhoneArea() {
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.resolvedLanguage;
  const [selectedCountry, setSelectedCountry] = useState(AREA_CODE.find((area) => area.lang === selectedLanguage));

  useEffect(() => {
    console.log(selectedCountry);
  }, [selectedCountry]);

  return (
    <Select value={selectedCountry?.code} onValueChange={(e) => setSelectedCountry(AREA_CODE.find((area) => area.code === e))}>
      <SelectTrigger className='h-full w-[55px] bg-input p-2 text-xs hover:bg-input-hover'>
        <SelectValue>
          <img
            width={18}
            height={18}
            src={new URL(`../../../assets/icons/i18n/${selectedCountry?.icon}.svg`, import.meta.url).href}
            alt={selectedLanguage}
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
