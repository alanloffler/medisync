// import { NumberFormatBase } from 'react-number-format';
import { Input } from '@/core/components/ui/input';
import { PatternFormat } from 'react-number-format';

export function SlotInput() {
  const isAllowed = (values: { formattedValue: string; floatValue: number | undefined }) => {
    const { formattedValue, floatValue } = values;
    if (floatValue === undefined) return true;

    function splitNumber(num: string) {
      const str = num.split(':');
      const firstPart = parseInt(str[0], 10);
      const secondPart = parseInt(str[1], 10);

      return [firstPart, secondPart];
    }
    const [part1, part2] = splitNumber(formattedValue);
    console.log(part1, part2);
    console.log(values)
    // Ensure the hour is between 0 and 23 and the minute is between 0 and 59
    if (part1 >= 0 && part1 <= 23) {
      if (isNaN(part2)) {
        return true;
      } else {
      if (part2 >= 0 && part2 <= 59) {
        return true;
      } else {
        return false;
      }
      }
    } else {
      return false;
    }
  };

  return (
    <PatternFormat
      customInput={Input}
      placeholder='00:00'
      format='##:##'
      // allowEmptyFormatting
      valueIsNumericString
      mask='-'
      isAllowed={isAllowed}
      className='text-muted-foreground focus-visible:text-black h-9'
      // className='flex h-10 w-full rounded-md bg-slate-100/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'
    />
  );
}
