// Icons: https://lucide.dev/icons
import { CalendarIcon } from 'lucide-react';
// External components
import { Button } from '@core/components/ui/button';
import { Calendar } from '@core/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@core/components/ui/popover';
// External imports
import { format } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  className?: string;
  defaultDate?: Date | undefined;
  disabledDays?: number[];
  onDateChange?: (date: Date | undefined) => void;
}
// React component
export function DatePicker({ className, defaultDate, disabledDays, onDateChange }: IProps) {
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  function handleDateSelect(selectedDate: Date | undefined): void {
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange?.(selectedDate);
      setOpen(false);
    }
  }

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-[37px] w-[140px] justify-start border-transparent !p-0 text-left !text-sm font-normal hover:bg-transparent data-[state=open]:border-slate-200',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <div className='flex h-[35px] w-full items-center rounded-md bg-input px-3 py-2'>
            <CalendarIcon size={16} strokeWidth={2} className='mr-2' />
            {date ? format(date, 'short') : <span>{t('placeholder.pickDate')}</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          disabled={[{ dayOfWeek: disabledDays ?? [] }]}
          mode='single'
          showOutsideDays={false}
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
