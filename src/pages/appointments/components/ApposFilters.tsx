// External components: http://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// External imports
import { useEffect, useState } from 'react';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import { type IApposFilters, useApposFilters } from '@appointments/hooks/useApposFilters';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function ApposFilters({ appointments }: { appointments: IAppointmentView[] }) {
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const capitalize = useCapitalize();
  const { professional, setFilters } = useApposFilters();

  useEffect(() => {
    // TODO: find unique professionals by user from database method
    // const professionalsFiltered: IProfessional[] = appointments
    //   .map((appointment: IAppointmentView) => appointment.professional)
    //   .filter((professional: IProfessional, index: number, self: IProfessional[]) => index === self.findIndex((p) => p._id === professional._id))
    //   .sort((a: IProfessional, b: IProfessional) => a.lastName.localeCompare(b.lastName));

    // setProfessionals(professionalsFiltered);
    setProfessionals([
      {
        _id: '66c9dec69c2d5d22c5399b45',
        firstName: 'susana',
        lastName: 'barrios',
        title: {
          _id: '66a970803bdb5eb3f8ca3afa',
          abbreviation: 'bioq.',
        },
      },
      {
        _id: '67101e1284dc5351a1712895',
        firstName: 'isabel',
        lastName: 'correa',
        title: {
          _id: '66a9705f3bdb5eb3f8ca3af8',
          abbreviation: 'téc.',
        },
      },
      {
        _id: '66c9279455ce3eb6af8a44db',
        firstName: 'silvana',
        lastName: 'valiente',
        title: {
          _id: '66a9703b3bdb5eb3f8ca3af2',
          abbreviation: 'lic.',
        },
      },
    ]);
  }, [appointments]);

  return (
    <main>
      <h1>ApposFilters</h1>
      <Select value={professional} onValueChange={(e) => setFilters({ professional: e as IApposFilters['professional'] })}>
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
    </main>
  );
}
