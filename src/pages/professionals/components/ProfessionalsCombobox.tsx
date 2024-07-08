// Icons: https://lucide.dev/icons
import { Check, ChevronsUpDown } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/core/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
// App components
import { LoadingDB } from '@/core/components/common/LoadingDB';
// App
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { cn } from '@/lib/utils';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState } from 'react';
// Interface
interface IProfessionalsCombobox {
  onSelectProfessional: (professional: IProfessional) => void;
  options: {
    loadingText: string;
    notFoundText: string;
    placeholder: string;
    searchText: string;
  };
}
// React component
export function ProfessionalsCombobox({ onSelectProfessional, options }: IProfessionalsCombobox) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<IProfessional[]>([] as IProfessional[]);
  const [value, setValue] = useState<string>('');
  const capitalize = useCapitalize();
  const { loadingText, notFoundText, placeholder, searchText } = options;

  useEffect(() => {
    setIsLoading(true);
    // prettier-ignore
    ProfessionalApiService
    .findAllActive()
    .then((response) => {
      // TODO: handle errors!
      // TODO: change response from database IResponse
      if (!response.statusCode) {
        setProfessionals(response);
      }
      setIsLoading(true);
    });
  }, []);

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button role='combobox' aria-expanded={openCombobox} className='w-full justify-between bg-white text-foreground shadow-sm hover:bg-white'>
          {isLoading ? <LoadingDB text={loadingText} /> : value ? capitalize(value) : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder={searchText} />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {professionals.map((professional) => (
                <CommandItem
                  key={professional._id}
                  value={`${professional.titleAbbreviation} ${[professional.lastName, professional.firstName].join(', ')}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpenCombobox(false);
                    onSelectProfessional(professional);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === `${professional.titleAbbreviation} ${[professional.lastName, professional.firstName].join(',')}` ? 'opacity-100' : 'opacity-0')} />
                  {`${capitalize(professional.titleAbbreviation)} ${capitalize(professional.lastName)}, ${capitalize(professional.firstName)}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
