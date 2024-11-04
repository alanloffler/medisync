// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { IconShortcut } from '@dashboard/components/shortcuts/IconShortcut';
// External imports
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IArea } from '@core/interfaces/area.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { AreaService } from '@core/services/area.service';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
// React component
export function CategoriesShortcuts() {
  const [areaSelected, setAreaSelected] = useState<string>('');
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);

  const { data: categories } = useQuery<IArea[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await AreaService.findAll();
      return response.data;
    },
  });

  function extractSpecializations(categories: IArea[] | undefined) {
    if (!categories) return [];
    return categories.flatMap((category) => category.specializations);
  }

  useEffect(() => {
    console.log(areaSelected);
    const _specializations = extractSpecializations(categories);
    setSpecializations(_specializations);
    console.log(_specializations);
  }, [areaSelected, categories]);

  return (
    <Card className='space-y-4 p-4 xl:col-span-2'>
      <h5 className='text-lg font-medium leading-none'>{DASHBOARD_CONFIG.categoriesShortcuts.title}</h5>
      <section className='flex w-full flex-row justify-center space-x-4'>
        {categories?.map((category) => (
          <IconShortcut
            icon={category.icon}
            iconSize={24}
            itemSize={90}
            key={crypto.randomUUID()}
            label={category.name}
            setAreaSelected={setAreaSelected}
          />
        ))}
      </section>
      <section>
        {specializations.map((specialization) => (
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
