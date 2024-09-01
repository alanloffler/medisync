import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IUser } from '@/pages/users/interfaces/user.interface';
import { addMinute, format } from '@formkit/tempo';

export interface IAppointmentForm {
  day: string;
  hour: string;
  professional: string;
  slot: number;
  user: string;
}

export interface IAppointment extends IAppointmentForm {
  _id: string;
}

export interface IAppointmentView {
  _id: string;
  day: string;
  hour: string;
  professional: IProfessional;
  slot: number;
  user: IUser;
}

interface ITimeRange {
  begin: Date;
  end: Date;
}

interface ITimeRangeString {
  begin: string;
  end: string;
}

export interface ITimeSlot {
  appointment?: IAppointmentView;
  available: boolean;
  begin: string;
  end: string;
  id: number;
}

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

  public generateTimeSlots(): ITimeSlot[] {
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

  private isTimeSlotAvailable(begin: Date, end: Date, unavailableRanges: ITimeRange[]): boolean {
    for (const range of unavailableRanges) {
      if (begin < range.end && end > range.begin) return false;
    }
    return true;
  }

  private insertNotAvailableSlot(slots: ITimeSlot[], newSlot: ITimeRangeString): void {
    let insertIndex = 0;

    while (insertIndex < slots.length && slots[insertIndex].begin < newSlot.begin) insertIndex++;

    slots.splice(insertIndex, 0, {
      id: -1,
      begin: newSlot.begin,
      end: newSlot.end,
      available: false,
    });
  }
}
