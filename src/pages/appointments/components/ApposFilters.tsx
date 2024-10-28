// External components: http://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// External imports
import { useEffect, useState } from 'react';
// Imports
import type { IApposFilters } from '@appointments/hooks/useApposFilters';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function ApposFilters({ userId }: { userId: string }) {
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const capitalize = useCapitalize();
  const { setFilters } = useApposFilters();

  useEffect(() => {
    // TODO: manage error for all api calls
    AppointmentApiService.findUniqueProfessionalsByUser(userId).then((response: IResponse) => setProfessionals(response.data));

    AppointmentApiService.findApposYearsByUser(userId).then((response: IResponse) => setYears(response.data));
  }, [userId]);

  return (
    <main>
      <h1>ApposFilters</h1>
      <section>
        <Select onValueChange={(e) => setFilters({ professional: e as IApposFilters['professional'] })}>
          <SelectTrigger className={'h-8 w-fit space-x-2 border bg-white text-[13px] shadow-sm'}>
            <SelectValue placeholder={'Profesionales'} />
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
      </section>
      <section>
        <Select onValueChange={(e) => setFilters({ year: e as IApposFilters['year'] })}>
          <SelectTrigger className={'h-6 w-fit space-x-2 border bg-white text-xs shadow-sm'}>
            <SelectValue placeholder={USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.yearSelect.placeholder} />
          </SelectTrigger>
          <SelectContent className='w-fit min-w-10' onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              {years.map((year) => (
                <SelectItem key={crypto.randomUUID()} value={year} className='py-1 text-xs [&>span>span>svg]:h-3 [&>span>span>svg]:w-3'>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
    </main>
  );
}
