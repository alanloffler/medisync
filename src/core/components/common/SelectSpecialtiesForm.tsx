// External components: https://ui.shadcn.com/docs/components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { Control } from 'react-hook-form';
import type { IArea } from '@core/interfaces/area.interface';
import type { IResponse } from '@core/interfaces/response.interface';
// import { APP_CONFIG } from '@config/app.config';
import { AreaService } from '@core/services/area.service';
// import { OpenAIService } from '@lib/openai.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
// Interface
interface IFormSelect {
  callback: (value: string) => void;
  formControl: Control<any>;
}
// React component
export function SelectSpecialtiesForm({ formControl, callback }: IFormSelect) {
  const [translation, setTranslation] = useState<IArea[]>([] as IArea[]);
  const capitalize = useCapitalize();
  const { i18n, t } = useTranslation();

  const {
    data: areas,
    isError,
    isLoading,
  } = useQuery<IResponse<IArea[]>>({
    queryKey: ['areas', ['input-form-select']],
    queryFn: async () => await AreaService.findAll(),
    refetchOnWindowFocus: false,
    retry: 0,
    staleTime: 0,
  });

  // async function execTranslation(element: string, language: string) {
  //   return await OpenAIService.translate(element, language);
  // }

  useEffect(() => {
    // console.log('Loading areas is success');
    // if (areas) {
    //   const selectedLanguage = localStorage.getItem('i18nextLng') ?? i18n.language;
    //   if (selectedLanguage !== APP_CONFIG.i18n.locale) {
    //     const translated = areas.data.map(async (area) => {
    //       const translation = await execTranslation(area.name, selectedLanguage);
    //       return { ...area, name: translation?.replace(/"/g, '') || area.name };
    //     });
    //     Promise.all(translated).then((data) => {
    //       setTranslation(data);
    //       console.log('All translations ended successfully');
    //     });
    //   } else {
    //     setTranslation(areas.data);
    //   }
    // }
    if (areas) setTranslation(areas.data)
  }, [areas, i18n.language]);

  return (
    <FormField
      control={formControl}
      name='area'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('table.header.area')}</FormLabel>
          <Select
            defaultValue={field.value}
            disabled={translation && translation.length < 1}
            onValueChange={(event) => {
              field.onChange(event);
              callback(event);
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`} disabled={isError}>
                {isLoading ? (
                  <LoadingText text={t('loading.default')} suffix='...' />
                ) : isError ? (
                  <span className='text-red-400'>{t('error.default')}</span>
                ) : (
                  <SelectValue placeholder={t('placeholder.area')} />
                )}
              </SelectTrigger>
            </FormControl>
            <FormMessage />
            <SelectContent>
              {translation &&
                translation.length > 0 &&
                translation.map((el: IArea) => (
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
