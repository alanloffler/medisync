// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { IconShortcut } from '@dashboard/components/shortcuts/IconShortcut';
// External imports
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IArea } from '@core/interfaces/area.interface';
import { AreaService } from '@core/services/area.service';
// React component
export function CategoriesShortcuts() {
  const [areaSelected, setAreaSelected] = useState<string>('');

  const { data: categories } = useQuery<IArea[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await AreaService.findAll();
      return response.data;
    },
  });

  useEffect(() => {
    console.log(areaSelected);
  }, [areaSelected]);

  return (
    <Card className='space-y-4 p-4 xl:col-span-2'>
      {/* TODO: dynamic title from config file */}
      <h5 className='text-lg font-medium leading-none'>Categorías</h5>
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
    </Card>
  );
}
