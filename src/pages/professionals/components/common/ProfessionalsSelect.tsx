// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// Imports
import type { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { PROFESSIONALS_SELECT_CONFIG as PS_CONFIG } from '@/config/professionals.config';
import { cn } from '@/lib/utils';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function ProfessionalsSelect({
  className,
  professionals,
  onValueChange,
}: {
  className?: string;
  professionals: IProfessional[];
  onValueChange?: (e: string) => void;
}) {
  const capitalize = useCapitalize();

  return (
    <main className='flex flex-col items-start space-y-1'>
      <span className='text-[13px] font-medium text-slate-500'>{PS_CONFIG.label}</span>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className={cn('h-8 w-full space-x-2 border bg-white text-[13px] shadow-sm', className)}>
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
