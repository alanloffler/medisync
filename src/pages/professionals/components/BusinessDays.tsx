// Components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@/core/components/ui/checkbox';
import { Label } from '@/core/components/ui/label';
// App
import { IWorkingDaysProps } from '@/pages/professionals/interfaces/working-days.interface';
// React component
export function BusinessDays({ label, data, handleWorkingDaysValues }: IWorkingDaysProps) {
  // TODO: get this data from another editable way
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  // Actions when checkbox checked changes
  function handleCheckedChange(dayIndex: number, checked: boolean) {
    const updatedValues = data.find((value) => value.day === dayIndex);
    if (updatedValues) {
      updatedValues.value = checked;
      handleWorkingDaysValues([...data]);
    }
  }

  return (
    <div className='flex w-full flex-col space-y-3'>
      <Label>{label}</Label>
      <div className='flex flex-row justify-start space-x-3'>
        {data.map((_, index) => (
          <div key={index} className='flex flex-col items-center'>
            <Checkbox 
              defaultChecked={data.find((value) => value.day === index)?.value || false} 
              onCheckedChange={(checked) => handleCheckedChange(index, checked as boolean)} 
            />
            <span className='text-xs font-medium'>{DAYS[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
