// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { IconShortcut } from '@dashboard/components/shortcuts/IconShortcut';
// External imports
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { SpecializationService } from '@core/services/specialization.service';
// React component
export function CategoriesShortcuts() {
  const [areaSelected, setAreaSelected] = useState<string>('');

  const { data: specializations } = useQuery<IResponse>({
    queryKey: ['specializations'],
    queryFn: async () => {
      return await SpecializationService.findAll();
    },
  });

  return (
    <Card className='space-y-4 p-4 xl:col-span-2'>
      <h5 className='text-lg font-medium leading-none'>{DASHBOARD_CONFIG.categoriesShortcuts.title}</h5>
      <section className='flex w-full flex-row justify-center space-x-4'>
        {specializations?.data.map((specialization: ISpecialization) => (
          <IconShortcut
            icon={specialization.icon}
            iconSize={24}
            itemSize={90}
            key={crypto.randomUUID()}
            label={specialization.name}
            setAreaSelected={setAreaSelected}
          />
        ))}
      </section>
    </Card>
  );
}
