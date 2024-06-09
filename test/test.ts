interface ITimeRange {
  begin: Date;
  end: Date;
}

interface IAppointment {
  turn: number;
  professional: number;
  name: string;
}

interface ITimeSlot {
  begin: string;
  end: string;
  available: boolean;
  id: number;
  appointment?: IAppointment;
}

export class AppoSchedule {
  public name: string;
  private startDayHour: Date;
  private endDayHour: Date;
  private appoMinutes: number;
  private unavailableRanges: ITimeRange[];
  public timeSlots: ITimeSlot[];

  constructor(
    name: string, 
    startDayHour: Date, 
    endDayHour: Date, 
    appoMinutes: number, 
    unavailableRanges: ITimeRange[]
  ) {
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

  public insertAppointments(appointments: IAppointment[]): void {
    for (const appointment of appointments) {
      const matchingTimeSlotIndex = this.timeSlots.findIndex(timeSlot => timeSlot.id === appointment.turn);
      if (matchingTimeSlotIndex !== -1) {
        this.timeSlots[matchingTimeSlotIndex] = { 
          ...this.timeSlots[matchingTimeSlotIndex], 
          appointment: { ...appointment } 
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

  // for (const appointment of appointments) {
  //   const matchingTimeSlotIndex = timeSlots.findIndex(timeSlot => timeSlot.id === appointment.turn);
  //   if (matchingTimeSlotIndex !== -1) {
  //     timeSlots[matchingTimeSlotIndex] = { ...timeSlots[matchingTimeSlotIndex], appointment: {...appointment} };
  //   }
  // }
  
  // console.log(timeSlots);
  // Test for the class for schedule creation
  // const testHours = new Date();
  // const testMin = new Date();
  // const beginHour = new Date();
  // const endHour = new Date();
  // testHours.setHours(8, 0);
  // testMin.setHours(18, 0);
  // beginHour.setHours(12, 0);
  // endHour.setHours(13, 0);


  // const appoSchedule = new AppoSchedule('Alan Schedule', testHours, testMin, 30, [{ begin: beginHour, end: endHour }]);
  // console.log('Here!', appoSchedule.generateTimeSlots());
  // const timeSlots = appoSchedule.generateTimeSlots();
  // const full = appoSchedule.insertAppointments(appointments);
  // console.log(full);

    // const startDayHour = new Date();
  // startDayHour.setHours(8, 0);
  // const endDayHour = new Date();
  // endDayHour.setHours(18, 0);
  // const intervalMinutes = 60;

  // // Rangos no disponibles, pueden ser varios
  // const unavailableRanges = [
  //   { begin: '12:00', end: '16:00' },
  // ];