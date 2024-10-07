// External components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@/core/components/ui/checkbox';
import { Label } from '@/core/components/ui/label';
// External imports
import { range } from '@formkit/tempo';
import { useEffect, useState } from 'react';
// Imports
import type { IWorkingDay, IWorkingDaysProps } from '@/pages/professionals/interfaces/working-days.interface';
import { generateWeekOfWorkingDays } from '@/pages/professionals/utils/week-working-days.util';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function WorkingDays({ label, data, handleWorkingDaysValues }: IWorkingDaysProps) {
  const [daysData, setDaysData] = useState<IWorkingDay[]>([]);
  const capitalize: (text: string | undefined) => string | undefined = useCapitalize();
  const DAYS: (string | undefined)[] = range('dddd', 'es').map((day) => capitalize(day));

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
      <Label>{label}</Label>
      <div className='flex flex-row justify-start space-x-3'>
        {daysData &&
          daysData.map((_, index) => (
            <div key={index} className='flex flex-col items-center'>
              <Checkbox
                defaultChecked={daysData.find((value) => value.day === index)?.value || false}
                onCheckedChange={(checked) => handleCheckedChange(index, checked as boolean)}
              />
              <span className='text-xs font-medium'>{DAYS[index]}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
