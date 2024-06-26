import { IUser } from "@/pages/users/interfaces/user.interface";

interface ITimeRange {
  begin: Date;
  end: Date;
}

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
  professional: Prof;
  slot: number;
  user: IUser;
}
interface Prof {
  _id: string;
  firstName: string;
  lastName: string;
  titleAbbreviation: string;
}
export interface ITimeSlot {
  begin: string;
  end: string;
  available: boolean;
  id: number;
  appointment?: IAppointmentView;
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
    let currentTime = this.startDayHour;
    let counter = 0;

    while (currentTime < this.endDayHour) {
      const id = counter;
      const nextTime = this.addMinutes(new Date(currentTime), this.appoMinutes);
      const available = this.isTimeSlotAvailable(currentTime, nextTime, this.unavailableRanges);

      slots.push({
        id,
        begin: this.formatTime(currentTime),
        end: this.formatTime(nextTime),
        available,
      });

      currentTime = nextTime;
      counter++;
    }
    return slots;
  }

  public insertAppointments(appointments: IAppointmentView[]): void {//not view
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
      if (begin < range.end && end > range.begin) {
        return false;
      }
    }
    return true;
  }
}