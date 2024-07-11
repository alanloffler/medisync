import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IUser } from '@/pages/users/interfaces/user.interface';

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
    let currentTime = this.startDayHour;
    let counter = 1;

    while (currentTime < this.endDayHour) {
      const nextTime = this.addMinutes(new Date(currentTime), this.appoMinutes);
      const available = this.isTimeSlotAvailable(currentTime, nextTime, this.unavailableRanges);

      if (available) {
        slots.push({
          id: counter,
          begin: this.formatTime(currentTime),
          end: this.formatTime(nextTime),
          available,
        });
        counter++;
      } else {
        notAvailableSlots.push({
          id: -1,
          begin: this.formatTime(currentTime),
          end: this.formatTime(nextTime),
          available,
        });
      }
      currentTime = nextTime;
    }

    const notAvailableSlot: ITimeRangeString = {
      begin: notAvailableSlots[0].begin,
      end: notAvailableSlots[notAvailableSlots.length - 1].end,
    };

    this.insertNotAvailableSlot(slots, notAvailableSlot);

    return slots;
  }

  public insertAppointments(appointments: IAppointmentView[]): void {
    for (const appointment of appointments) {
      const matchingTimeSlotIndex = this.timeSlots.findIndex((timeSlot) => timeSlot.id === appointment.slot);

      if (matchingTimeSlotIndex !== -1) {
        this.timeSlots[matchingTimeSlotIndex] = {
          ...this.timeSlots[matchingTimeSlotIndex],
          appointment: { ...appointment },
        };
      }
    }
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
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
