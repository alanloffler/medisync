// Components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@/core/components/ui/checkbox';
import { Label } from '@/core/components/ui/label';
// React component
export function BusinessDays({label, workingDays}: {label: string; workingDays: number[]}) {
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  // console.log('workingDays inside component', workingDays);
  return (
    <div className='flex flex-col w-full space-y-3'>
      <Label className=''>{label}</Label>
      <div className='flex flex-row w-full items-center justify-start gap-2'>
        {DAYS.map((day) => (
          <div key={day} className='flex flex-col items-center'>
            <Checkbox checked={workingDays.includes(DAYS.indexOf(day))} />
            <Label>{day}</Label>
          </div>
        ))}
      </div>
      {/* <div>
        <Checkbox />
        <Label>Lunes</Label>
      </div>
      <div>
        <Checkbox />
        <Label>Martes</Label>
      </div>
      <div>
        <Checkbox />
        <Label>Miércoles</Label>
      </div>
      <div>
        <Checkbox />
        <Label>Jueves</Label>
      </div>
      <div>
        <Checkbox />
        <Label>Viernes</Label>
      </div>
      <div>
        <Checkbox />
        <Label>Sábado</Label>
      </div> */}
    </div>
  );
}
