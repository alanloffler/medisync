// Icons: https://lucide.dev/icons
import { Check, ChevronsUpDown } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@core/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@core/components/ui/popover';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
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
export function ProfessionalsCombobox({ className, onSelectProfessional, options }: IProfessionalsCombobox) {
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(undefined);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { loadingText, notFoundText, placeholder, searchText } = options;
  const { professionalParam } = useReserveFilters();

  const {
    data: professionals,
    error,
    isError,
    isLoading,
  } = useQuery<IResponse<IProfessional[]>>({
    queryKey: ['professionals', 'professionals-active'],
    queryFn: async () => await ProfessionalApiService.findAllActive(),
  });

  useEffect(() => {
    if (isError) addNotification({ type: 'error', message: error?.message });
  }, [addNotification, error?.message, isError]);

  const handleSelectProfessional = useCallback(
    (currentValue: SetStateAction<string | undefined>, professional: IProfessional): void => {
      setValue(currentValue);
      setOpenCombobox(false);
      onSelectProfessional(professional);
    },
    [onSelectProfessional],
  );

  useEffect(() => {
    if (professionalParam && professionals?.data) {
      const find: IProfessional | undefined = professionals.data.find((professional) => professional._id === professionalParam);

      if (find) {
        onSelectProfessional(find);
        setValue(`${find.title.abbreviation} ${find.firstName} ${find.lastName}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalParam, professionals?.data]);

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button
          role='combobox'
          aria-expanded={openCombobox}
          className={cn('h-9 w-full justify-between bg-input px-3 !text-xsm font-normal text-foreground hover:bg-input-hover', className)}
        >
          {isLoading ? <LoadingText text={loadingText} suffix='...' /> : value ? UtilsString.upperCase(value, 'each') : placeholder}
          <ChevronsUpDown size={14} strokeWidth={2} className='ml-3 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mt-1 w-full p-0 !shadow-md' align='start'>
        <Command className='bg-slate-50/90'>
          {!isError && <CommandInput placeholder={searchText} />}
          <CommandList>
            {!isError && (
              <CommandEmpty className='pb-2'>
                <InfoCard text={notFoundText} type='flat' variant='warning' />
              </CommandEmpty>
            )}
            <CommandGroup>
              {isError ? (
                <InfoCard className='p-2 pr-2.5' text={error.message} type='flat' variant='error' />
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
  );
}
