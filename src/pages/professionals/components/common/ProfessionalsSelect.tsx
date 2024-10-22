// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// Imports
import type { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { PROFESSIONALS_SELECT_CONFIG as PS_CONFIG } from '@/config/professionals.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function ProfessionalsSelect({ professionals }: { professionals: IProfessional[] }) {
  const capitalize = useCapitalize();

  function handleSelectProfessional(professional: string): void {
    console.log('Select professional', professional);
  }

  return (
    <main className='flex flex-col items-start space-y-1'>
      <span className='text-sm font-medium text-slate-500'>Profesional</span>
      <Select onValueChange={(e) => handleSelectProfessional(e)}>
        <SelectTrigger className='h-8 w-[200px] border bg-white shadow-sm'>
          <SelectValue placeholder={PS_CONFIG.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {professionals.map((professional) => (
              <SelectItem key={crypto.randomUUID()} value={professional._id}>
                {capitalize(professional.title.abbreviation)} {capitalize(professional.lastName)}, {capitalize(professional.firstName)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
