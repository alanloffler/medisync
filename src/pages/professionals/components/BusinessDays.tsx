import { Checkbox } from '@/core/components/ui/checkbox';
import { Label } from '@/core/components/ui/label';

// Definir el tipo para los días de trabajo
interface WorkingDay {
  day: number;
  value: boolean;
}

interface BusinessDaysProps {
  label: string;
  bdValues: WorkingDay[];
  setBdValues: (values: WorkingDay[]) => void;
  // onValuesChange: (values: WorkingDay[]) => void; // Nueva prop para exponer valores al componente padre
}

export function BusinessDays({ label, bdValues, setBdValues }: BusinessDaysProps) {
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  function handleCheckedChange(dayIndex: number, checked: boolean) {
    console.log('dayIndex', dayIndex, 'checked', checked);// working

    // const updatedValues = bdValues.map((value) => 
    //   value.day === dayIndex ? { ...value, value: checked } : value
    // );

    const updatedValues = bdValues.find((value) => value.day === dayIndex);
    if (updatedValues) {
      updatedValues.value = checked;
      setBdValues([...bdValues]); // Actualizar los valores en el estado con la copia updatedValues);
    }
    console.log('updatesValues', updatedValues);
    // console.log(bdValues);
  }

  return (
    <div className='flex w-full flex-col space-y-3'>
      <Label className=''>{label}</Label>
      <div className='flex w-full flex-row items-center justify-start gap-2'>
        {bdValues.map((_, index) => (
          <div key={index} className='flex flex-col items-center'>
            <Checkbox
              
              defaultChecked={bdValues.find((value) => value.day === index)?.value || false}
              onCheckedChange={(checked) => handleCheckedChange(index, checked as boolean)}
            />
            <Label>{DAYS[index]}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
