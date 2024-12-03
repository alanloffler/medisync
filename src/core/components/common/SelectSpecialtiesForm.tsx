// External components: https://ui.shadcn.com/docs/components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { Control } from 'react-hook-form';
import type { IArea } from '@core/interfaces/area.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AreaService } from '@core/services/area.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
// Interface
interface IFormSelect {
  callback: (value: string) => void;
  formControl: Control<any>;
}
// React component
export function SelectSpecialtiesForm({ formControl, callback }: IFormSelect) {
  const capitalize = useCapitalize();
  const { t } = useTranslation();

  const { data: areas, isLoading } = useQuery<IResponse<IArea[]>>({
    queryKey: ['areas', ['input-form-select']],
    queryFn: async () => await AreaService.findAll(),
  });

  return (
    <FormField
      control={formControl}
      name='area'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('table.header.area')}</FormLabel>
          <Select
            defaultValue={field.value}
            disabled={areas && areas.data.length < 1}
            onValueChange={(event) => {
              field.onChange(event);
              callback(event);
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                {isLoading ? (
                  <LoadingDB variant='default' text={t('loading.default')} className='ml-0' />
                ) : (
                  <SelectValue placeholder={t('placeholder.area')} />
                )}
              </SelectTrigger>
            </FormControl>
            <FormMessage />
            <SelectContent>
              {areas &&
                areas.data.length > 0 &&
                areas.data.map((el: IArea) => (
                  <SelectItem key={el._id} value={el._id} className='text-sm'>
                    {capitalize(el.name)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
