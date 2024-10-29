// Icons: https://lucide.dev
import { Filter, X } from 'lucide-react';
// External components: http://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// External imports
import { useEffect, useState } from 'react';
// Imports
import type { IApposFilters } from '@appointments/interfaces/appos-filters.interface';
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
  const { professional, year, setFilters, clearFilters } = useApposFilters();

  useEffect(() => {
    // TODO: manage error for all api calls
    AppointmentApiService.findUniqueProfessionalsByUser(userId).then((response: IResponse) => setProfessionals(response.data));
    // TODO: this must be a method that change the year by the professional selected
    // No professional selected, get all years -> professionalSelected, get available years by professional
    AppointmentApiService.findApposYearsByUser(userId).then((response: IResponse) => setYears(response.data));
  }, [userId]);

  useEffect(() => {
    console.log('check professional years on db');
  }, [professional]);

  return (
    <main className='flex w-full items-center justify-between rounded-md border border-slate-300 bg-slate-200 px-4 py-2 shadow-sm'>
      <section className='flex items-center justify-start space-x-4'>
        <section className='flex items-center space-x-2'>
          <Filter size={16} strokeWidth={2} />
          <h1 className='text-sm font-medium'>{USER_VIEW_CONFIG.apposRecord.filters.title}</h1>
        </section>
        <Select value={professional ? professional : ''} onValueChange={(e) => setFilters({ professional: e as IApposFilters['professional'] })}>
          <SelectTrigger className={'h-7 w-fit space-x-3 border border-slate-300 bg-white text-[13px] shadow-sm'}>
            <SelectValue placeholder={USER_VIEW_CONFIG.apposRecord.select.professional.placeholder} />
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
        <Select value={year ? year : ''} onValueChange={(e) => setFilters({ year: e as IApposFilters['year'] })}>
          <SelectTrigger className={'h-7 w-fit space-x-3 border border-slate-300 bg-white text-[13px] shadow-sm'}>
            <SelectValue placeholder={USER_VIEW_CONFIG.apposRecord.select.year.placeholder} />
          </SelectTrigger>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              {years.map((year) => (
                <SelectItem key={crypto.randomUUID()} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      {(professional || year) && (
        <Button variant='clear' size='icon5' onClick={() => clearFilters({ professional, year })}>
          <X size={14} strokeWidth={2} />
        </Button>
      )}
    </main>
  );
}
