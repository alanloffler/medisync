// Icons: https://lucide.dev/icons
import { Check, ChevronsUpDown } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@core/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@core/components/ui/popover';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { cn } from '@lib/utils';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IProfessionalsCombobox {
  onSelectProfessional: (professional: IProfessional) => void;
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
  const [error, setError] = useState<boolean>(false);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<IProfessional[]>([] as IProfessional[]);
  const [value, setValue] = useState<string>('');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const { loadingText, notFoundText, placeholder, searchText } = options;
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    // prettier-ignore
    ProfessionalApiService
    .findAllActive()
    .then((response: IResponse) => {
      if (response.statusCode === 200) {
        setProfessionals(response.data);
      }
      if (response.statusCode > 399) {
        addNotification({ type: 'warning', message: response.message });
        setInfoCard({ type: 'warning', text: response.message });
        setError(true);
      }
      if (response instanceof Error) {
        addNotification({ type: 'error', message: t('error.internalServer') });
        setInfoCard({ type: 'error', text: t('error.internalServer') });
        setError(true);
      }
      setIsLoading(false);
    });
  }, [addNotification, t]);

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button
          role='combobox'
          aria-expanded={openCombobox}
          className={cn('h-10 w-full justify-between bg-white !text-sm font-normal text-foreground shadow-sm hover:bg-white', className)}
        >
          {isLoading ? <LoadingDB text={loadingText} /> : value ? capitalize(value) : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mt-2 w-full p-0 shadow-sm' align='start'>
        <Command>
          {!error && <CommandInput placeholder={searchText} className='h-8 text-xsm' />}
          <CommandList>
            {!error && <CommandEmpty>{notFoundText}</CommandEmpty>}
            <CommandGroup>
              {error ? (
                <div className='relative left-0 max-w-[300px]'>
                  <InfoCard type={infoCard.type} text={infoCard.text} />
                </div>
              ) : (
                <>
                  {professionals.map((professional) => (
                    <CommandItem
                      className='text-xsm'
                      key={professional._id}
                      value={`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpenCombobox(false);
                        onSelectProfessional(professional);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === `${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {`${capitalize(professional.title.abbreviation)} ${capitalize(professional.firstName)} ${capitalize(professional.lastName)}`}
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
