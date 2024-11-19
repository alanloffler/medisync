// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { useState } from 'react';
// React component
export function AvailableProfessional({ items, defaultValue }: { items: { id: number; label: string; value: boolean }[]; defaultValue: string }) {
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className='h-8 w-fit space-x-2 bg-transparent px-2 py-1 text-xs hover:bg-input'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <SelectGroup>
          <SelectItem value={items ? items[0].value.toString() : 'true'} className='px-2 py-1 text-xs focus:bg-input [&_svg]:hidden'>
            <div className='flex items-center space-x-2'>
              <div className='h-2.5 w-2.5 rounded-full bg-emerald-400'></div>
              <span>{items ? items[0].label : 'Active'}</span>
            </div>
          </SelectItem>
          <SelectItem value={items ? items[1].value.toString() : 'false'} className='px-2 py-1 text-xs focus:bg-input [&_svg]:hidden'>
            <div className='flex items-center space-x-2'>
              <div className='h-2.5 w-2.5 rounded-full bg-rose-400'></div>
              <span>{items ? items[1].label : 'Inactive'}</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
