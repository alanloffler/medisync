// External components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@core/components/ui/checkbox';
import { FormLabel } from '@core/components/ui/form';
// External imports
import { range } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IWorkingDay, IWorkingDaysProps } from '@professionals/interfaces/working-days.interface';
import { UtilsString } from '@core/services/utils/string.service';
import { generateWeekOfWorkingDays } from '@professionals/utils/week-working-days.util';
// React component
export function WorkingDays({ label, data, handleWorkingDaysValues }: IWorkingDaysProps) {
  const [days, setDays] = useState<string[]>([]);
  const [daysData, setDaysData] = useState<IWorkingDay[]>([]);
  const { i18n } = useTranslation();

  // TODO: refactor with useQuery hook
  useEffect(() => {
    function handleResize(): void {
      const windowWidth: number = window.innerWidth;

      if (windowWidth < 1140 && windowWidth >= 768) {
        setDays(range('ddd', i18n.resolvedLanguage).map((day) => day));
      } else {
        setDays(range('dddd', i18n.resolvedLanguage).map((day) => day));
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    const defaultWorkingDaysValues: IWorkingDay[] = generateWeekOfWorkingDays();

    !data || data === undefined || data.length === 0 ? setDaysData(defaultWorkingDaysValues) : setDaysData(data);
  }, [data]);

  function handleCheckedChange(dayIndex: number, checked: boolean) {
    if (!daysData) return;

    const updatedValues = daysData.find((value) => value.day === dayIndex);

    if (updatedValues) {
      updatedValues.value = checked;
      handleWorkingDaysValues([...daysData]);
    }
  }

  return (
    <div className='flex w-full flex-col space-y-3'>
      <FormLabel>{label}</FormLabel>
      <div className='flex flex-row justify-start space-x-3'>
        {daysData &&
          daysData.map((_, index) => (
            <div key={index} className='flex flex-col items-center'>
              <Checkbox
                defaultChecked={daysData.find((value) => value.day === index)?.value || false}
                onCheckedChange={(checked) => handleCheckedChange(index, checked as boolean)}
              />
              <span className='text-xs font-medium'>{UtilsString.upperCase(days[index])}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
