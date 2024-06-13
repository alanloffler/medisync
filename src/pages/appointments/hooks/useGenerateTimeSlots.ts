import { useState, useEffect } from 'react';

// Definición de tipos
interface ITimeRange {
  begin: string;
  end: string;
}

interface ITimeSlot extends ITimeRange {
  available: boolean;
  id: number;
  appointment?: {
    turn: number;
    professional: number;
    name: string;
  }
}

// Funciones auxiliares
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

const isTimeSlotAvailable = (begin: string, end: string, unavailableRanges: ITimeRange[]): boolean => {
  for (const range of unavailableRanges) {
    if (begin < range.end && end > range.begin) {
      return false;
    }
  }
  return true;
};

// El Hook
const useTimeSlots = (startTime: Date, endTime: Date, intervalMinutes: number, unavailableRanges: ITimeRange[]): ITimeSlot[] => {
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);

  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: ITimeSlot[] = [];
      let currentTime = startTime;

      let counter: number = 0;
      while (currentTime < endTime) {
        const id = counter;
        const begin = formatTime(currentTime);
        const nextTime = addMinutes(currentTime, intervalMinutes);
        const end = formatTime(nextTime);
        const available = isTimeSlotAvailable(begin, end, unavailableRanges);

        slots.push({ id, begin, end, available });
        currentTime = nextTime;
        counter++;
      }

      setTimeSlots(slots);
    };

    generateTimeSlots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return timeSlots;
};

export default useTimeSlots;
