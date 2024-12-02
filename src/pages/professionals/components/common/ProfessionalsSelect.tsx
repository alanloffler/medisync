// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { PROFESSIONALS_SELECT_CONFIG as PS_CONFIG } from '@config/professionals/professional-select.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { cn } from '@lib/utils';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function ProfessionalsSelect({
  className,
  defaultValue,
  onValueChange,
}: {
  className?: string;
  defaultValue?: string;
  onValueChange?: (e: string) => void;
}) {
  const capitalize = useCapitalize();
  const { t } = useTranslation();

  const { data: professionals } = useQuery<IResponse<IProfessional[]>, Error>({
    queryKey: ['professionals', ['input-select']],
    queryFn: async () => await ProfessionalApiService.findAllActive(),
  });

  return (
    <main className='flex flex-row items-center space-x-2'>
      <span className='text-xsm font-medium text-slate-500'>{t(PS_CONFIG.label)}</span>
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger className={cn('h-8 w-full space-x-2 border bg-white text-xsm shadow-sm', className)}>
          <SelectValue placeholder={t(PS_CONFIG.placeholder)} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {professionals?.data &&
              professionals?.data.map((professional) => (
                <SelectItem key={crypto.randomUUID()} value={professional._id} className='text-xsm'>
                  {capitalize(professional.title.abbreviation)} {capitalize(professional.firstName)} {capitalize(professional.lastName)}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
