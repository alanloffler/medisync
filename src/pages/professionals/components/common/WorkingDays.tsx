// Components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@/core/components/ui/checkbox';
import { Label } from '@/core/components/ui/label';
// App
import { APP_CONFIG } from '@/config/app.config';
import { IWorkingDay, IWorkingDaysProps } from '@/pages/professionals/interfaces/working-days.interface';
import { useEffect, useState } from 'react';
// React component
export function WorkingDays({ label, data, handleWorkingDaysValues }: IWorkingDaysProps) {
  const DAYS = APP_CONFIG.daysofWeek.long;
  const [daysData, setDaysData] = useState<IWorkingDay[]>([]);

  useEffect(() => {
    // TODO: get this value from database
    const defaultWorkingDaysValues: IWorkingDay[] = [
      { day: 0, value: false },
      { day: 1, value: false },
      { day: 2, value: false },
      { day: 3, value: false },
      { day: 4, value: false },
      { day: 5, value: false },
    ];
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
              {/* prettier-ignore */}
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
