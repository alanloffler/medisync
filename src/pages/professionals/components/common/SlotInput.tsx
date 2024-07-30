// import { NumberFormatBase } from 'react-number-format';
import { Input } from '@/core/components/ui/input';
import { PatternFormat } from 'react-number-format';

export function SlotInput({ handleSlotInput }: { handleSlotInput: (slot: string) => void }) {

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

  function handleChange(value: string) {
    console.log('value', value);
    handleSlotInput(value);
  }

  return (
    <PatternFormat
      onChange={(e) => handleChange(e.target.value)}
      // onValueChange={(value) => handleSlotInput(value.formattedValue)}
      customInput={Input}
      placeholder='00:00'
      format='##:##'
      // allowEmptyFormatting
      valueIsNumericString
      mask='-'
      isAllowed={isAllowed}
      className='text-muted-foreground focus-visible:text-black h-9'
    />
  );
}
