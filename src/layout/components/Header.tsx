// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { ActionsButton } from '@layout/components/ActionsButton';
import { HeaderMenu } from '@layout/components/HeaderMenu';
// External imports
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { ILinks } from '@layout/interfaces/links.interface';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { LANGUAGES } from '@config/i18n.config';
// React component
export function Header() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.find((lang) => lang.code === i18n.language));
  const links: ILinks[] = HEADER_CONFIG.actionsButton;

  function onChangeLang(language: string): void {
    setSelectedLanguage(LANGUAGES.find((lang) => lang.code === language));
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  }

  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 bg-background px-4 shadow-sm md:px-6'>
      <HeaderMenu />
      <div className='flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <ActionsButton links={links} />
        <Select value={selectedLanguage?.code} onValueChange={(e) => onChangeLang(e)}>
          <SelectTrigger className='h-8 w-[55px] bg-input p-2 text-xs hover:bg-input-hover'>
            <SelectValue>
              <img
                width={18}
                height={18}
                src={new URL(`../../assets/icons/i18n/${selectedLanguage?.icon}.svg`, import.meta.url).href}
                alt={selectedLanguage?.label}
                className='mr-2'
              />
            </SelectValue>
          </SelectTrigger>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} className='min-w-0' align='end'>
            <SelectGroup>
              {LANGUAGES.map((language) => (
                <SelectItem key={crypto.randomUUID()} value={language.code}>
                  <div className='flex flex-row items-center space-x-2'>
                    <img
                      width={18}
                      height={18}
                      src={new URL(`../../assets/icons/i18n/${language.icon}.svg`, import.meta.url).href}
                      alt={language.label}
                    />
                    <div className='text-xs'>{language.label}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
