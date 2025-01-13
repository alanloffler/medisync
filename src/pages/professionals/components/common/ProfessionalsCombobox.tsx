// Icons: https://lucide.dev/icons
import { Check, ChevronsUpDown, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@core/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@core/components/ui/popover';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingText } from '@core/components/common/LoadingText';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { cn } from '@lib/utils';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useReserveFilters } from '@appointments/hooks/useReserveFilters';
// Interface
interface IProfessionalsCombobox {
  onSelectProfessional: (professional: IProfessional | undefined) => void;
  options: {
    loadingText: string;
    notFoundText: string;
    placeholder: string;
    searchText: string;
  };
  className?: string;
}
// React component
export function ProfessionalsCombobox({ onSelectProfessional, options, className }: IProfessionalsCombobox) {
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(undefined);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { loadingText, notFoundText, placeholder, searchText } = options;
  const { professionalParam, clearFilters, setFilters } = useReserveFilters();
  const { t } = useTranslation();

  const {
    data: professionals,
    error,
    isError,
    isLoading,
  } = useQuery<IResponse<IProfessional[]>>({
    queryKey: ['professionals', 'professionals-active'],
    queryFn: async () => await ProfessionalApiService.findAllActive(),
    retry: 1,
  });

  useEffect(() => {
    setInfoCard({ type: 'error', text: error?.message });
    if (error?.message !== undefined) addNotification({ type: 'error', message: error?.message });
  }, [error?.message, addNotification]);

  function handleSelectProfessional(currentValue: SetStateAction<string | undefined>, professional: IProfessional): void {
    setValue(currentValue);
    setOpenCombobox(false);
    onSelectProfessional(professional);
    setFilters({ professionalParam: professional._id });
  }

  function handleClear(): void {
    setValue('');
    onSelectProfessional(undefined);
    clearFilters({ professionalParam });
  }

  useEffect(() => {
    if (professionalParam) {
      const finded = professionals?.data.find((prof) => prof._id === professionalParam);
      finded && setValue(`${finded.title.abbreviation} ${finded.firstName} ${finded.lastName}`);
    }
  }, [professionals?.data, professionalParam]);

  return (
    <section className='flex items-center space-x-3'>
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            role='combobox'
            aria-expanded={openCombobox}
            className={cn('h-9 w-full justify-between !bg-slate-100/70 px-3 !text-sm font-normal text-foreground hover:!bg-slate-100', className)}
          >
            {isLoading ? <LoadingText text={loadingText} suffix='...' /> : value ? UtilsString.upperCase(value, 'each') : placeholder}
            <ChevronsUpDown size={14} strokeWidth={2} className='ml-3 shrink-0 text-primary opacity-100' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='mt-2 w-full border p-0 shadow-sm' align='start'>
          <Command>
            {!isError && <CommandInput placeholder={searchText} className='h-8 text-xsm' />}
            <CommandList>
              {!isError && <CommandEmpty>{notFoundText}</CommandEmpty>}
              <CommandGroup>
                {isError ? (
                  <div className='relative left-0 max-w-[300px]'>
                    <InfoCard type={infoCard.type} text={infoCard.text} />
                  </div>
                ) : (
                  <>
                    {professionals?.data &&
                      professionals?.data.map((professional) => (
                        <CommandItem
                          className='text-xsm'
                          key={professional._id}
                          value={`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`}
                          onSelect={(currentValue) => handleSelectProfessional(currentValue, professional)}
                        >
                          <Check
                            className={cn(
                              'mr-2',
                              value === `${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                            size={16}
                            strokeWidth={2}
                          />
                          {UtilsString.upperCase(`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`, 'each')}
                        </CommandItem>
                      ))}
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <TooltipWrapper tooltip={t('tooltip.delete')}>
          <Button variant='clear' size='icon5' className='bg-rose-400 text-white hover:bg-rose-500' onClick={handleClear}>
            <X size={14} strokeWidth={2} />
          </Button>
        </TooltipWrapper>
      )}
    </section>
  );
}
