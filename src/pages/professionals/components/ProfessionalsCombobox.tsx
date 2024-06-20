// Icons: https://lucide.dev/icons
import { Check, ChevronsUpDown } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/core/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
// App
import { IProfessional } from '../interfaces/professional.interface';
import { ProfessionalApiService } from '../services/professional-api.service';
import { cn } from '@/lib/utils';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState } from 'react';
// React component
export function ProfessionalsCombobox({ onSelectProfessional, placeholder, searchText }: { onSelectProfessional: (professional: IProfessional) => void; placeholder: string; searchText: string }) {
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const capitalize = useCapitalize();

  useEffect(() => {
    ProfessionalApiService.findAllActive().then((response) => {
      if (!response.statusCode) {
        setProfessionals(response);
      }
    });
  }, []);

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button role='combobox' aria-expanded={openCombobox} className='w-full justify-between bg-white text-foreground shadow-sm hover:bg-white'>
          {value ? capitalize(value) : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder={searchText} />
          <CommandList>
            <CommandEmpty>Profesional no encontrado</CommandEmpty>
            <CommandGroup>
              {professionals.map((professional) => (
                <CommandItem
                  key={professional._id}
                  value={[professional.lastName, professional.firstName].join(', ')}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpenCombobox(false);
                    onSelectProfessional(professional);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === professional._id ? 'opacity-100' : 'opacity-0')} />
                  {`${capitalize(professional.lastName)}, ${capitalize(professional.firstName)}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
