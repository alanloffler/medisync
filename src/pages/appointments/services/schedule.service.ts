import { IAppointmentView } from '@/pages/appointments/interfaces/appointment.interface';
import { ITimeRange, ITimeRangeString, ITimeSlot } from '@/pages/appointments/interfaces/appointment.interface';
import { addMinute, format, isAfter, isEqual } from '@formkit/tempo';

export class AppoSchedule {
  public name: string;
  private startDayHour: Date;
  private endDayHour: Date;
  private appoMinutes: number;
  private unavailableRanges: ITimeRange[];
  public timeSlots: ITimeSlot[];

  constructor(name: string, startDayHour: Date, endDayHour: Date, appoMinutes: number, unavailableRanges: ITimeRange[]) {
    this.name = name;
    this.startDayHour = startDayHour;
    this.endDayHour = endDayHour;
    this.appoMinutes = appoMinutes;
    this.unavailableRanges = unavailableRanges;
    this.timeSlots = this.generateTimeSlots();
  }

  private generateTimeSlots(): ITimeSlot[] {
    const slots: ITimeSlot[] = [];
    const notAvailableSlots: ITimeSlot[] = [];
    let currentTime: Date = this.startDayHour;
    let counter: number = 1;

    while (currentTime < this.endDayHour) {
      const nextTime: Date = addMinute(currentTime, this.appoMinutes);
      const available: boolean = this.isTimeSlotAvailable(currentTime, nextTime, this.unavailableRanges);

      if (available) {
        slots.push({
          id: counter,
          begin: format(currentTime, 'HH:mm'),
          end: format(nextTime, 'HH:mm'),
          available: true,
        });
        counter++;
      } else {
        notAvailableSlots.push({
          id: -1,
          begin: format(currentTime, 'HH:mm'),
          end: format(nextTime, 'HH:mm'),
          available: false,
        });
      }
      currentTime = nextTime;
    }

    if (notAvailableSlots.length > 0 && notAvailableSlots[0].begin && notAvailableSlots[notAvailableSlots.length - 1].end) {
      const notAvailableSlot: ITimeRangeString = {
        begin: notAvailableSlots[0].begin,
        end: notAvailableSlots[notAvailableSlots.length - 1].end,
      };

      this.insertNotAvailableSlot(slots, notAvailableSlot);
    }

    return slots;
  }

  private isTimeSlotAvailable(begin: Date, end: Date, unavailableRanges: ITimeRange[]): boolean {
    for (const range of unavailableRanges) {
      if (begin < range.end && end > range.begin) return false;
    }
    return true;
  }

  private insertNotAvailableSlot(slots: ITimeSlot[], newSlot: ITimeRangeString): void {
    let insertIndex: number = 0;

    while (insertIndex < slots.length && slots[insertIndex].begin < newSlot.begin) insertIndex++;

    slots.splice(insertIndex, 0, {
      id: -1,
      begin: newSlot.begin,
      end: newSlot.end,
      available: false,
    });
  }

  public insertAppointments(appointments: IAppointmentView[]): void {
    for (const appointment of appointments) {
      const matchingTimeSlotIndex: number = this.timeSlots.findIndex((timeSlot) => timeSlot.id === appointment.slot);

      if (matchingTimeSlotIndex !== -1) {
        this.timeSlots[matchingTimeSlotIndex] = {
          ...this.timeSlots[matchingTimeSlotIndex],
          appointment: { ...appointment },
        };
      }
    }
  }

  public totalAvailableSlots(slots: ITimeSlot[]): number {
    const totalAvailableSlots: number = slots.reduce((acc, item) => {
      if (item.available) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    return totalAvailableSlots;
  }

  public static isDatetimeInFuture(date: Date | undefined, time: string): boolean {
    if (!date) return false;
    
    const today: Date = new Date();
    const selectedDay: Date = new Date(date);
    selectedDay.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);

    return isAfter(selectedDay, today);
  }

  public availableSlotsToReserve(date: Date, timeSlots: ITimeSlot[], appointments: number): number {
    let result: number;

    const dateIsInFuture: boolean = isAfter(date, new Date());
    (dateIsInFuture) ? result = this.totalAvailableSlots(timeSlots) - appointments : result = 0;

    const actualDay: string = format(new Date(), 'YYYY-MM-DD');
    const selectedDay: string = format(date, 'YYYY-MM-DD');

    if (isEqual(actualDay, selectedDay)) {
      const actualTime: string = format(new Date(), 'HH:mm');
      const timeSlotsToReserve: ITimeSlot[] = timeSlots.filter((timeSlot) => timeSlot.available && timeSlot.begin > actualTime);
      
      result = this.totalAvailableSlots(timeSlotsToReserve);
    }

    return result;
  }
}
