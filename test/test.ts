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

  public insertAppointments(appointments: IAppointment[]): void {
    for (const appointment of appointments) {
      const matchingTimeSlotIndex = this.timeSlots.findIndex((timeSlot) => timeSlot.id === appointment.turn);
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

// Email link open gmail in new tab
// window.open(`https://mail.google.com/mail/?view=cm&to=${email.to}&su=${email.subject}&body=${email.body}`, '_blank')

// useQuery for pagination cached
// const {
//   data: appointments,
//   error,
//   isError,
//   isLoading,
//   isPlaceholderData,
// } = useQuery({
//   queryKey: ['appointments', 'listAll', page, limit],
//   queryFn: () => AppointmentApiService.findAll(page, limit),
//   placeholderData: keepPreviousData,
//   refetchOnWindowFocus: 'always',
//   retry: 1,
// });

// useEffect(() => {
//   if (!isPlaceholderData && appointments?.pagination?.hasMore) {
//     queryClient.prefetchQuery({
//       queryKey: ['appointments', 'listAll', page + 1, limit],
//       queryFn: () => AppointmentApiService.findAll(page + 1, limit),
//     });
//   }
// }, [appointments, isPlaceholderData, limit, page]);

// REMOVED ON DATABASE, POSSIBLE USED ON ANOTHER STATS DATA FETCH
// async countByMonth(month: string, year: string): Promise<IResponse<IDataUser>> {
//   const _month = parseInt(month);
//   const _year = parseInt(year);
//   const actualYear = new Date().getFullYear();

//   const monthSchema = z.number().min(1).max(12);
//   const yearSchema = z.number().min(2022).max(actualYear);

//   if (!monthSchema.safeParse(_month).success) throw new HttpException(USERS_CONFIG.inlineValidation.month, HttpStatus.BAD_REQUEST);
//   if (!yearSchema.safeParse(_year).success) throw new HttpException(USERS_CONFIG.inlineValidation.year, HttpStatus.BAD_REQUEST);

//   const startDate = new Date(_year, _month - 1, 1);
//   const endDate = new Date(_year, _month, 1);

//   const count = await this.userModel.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } });

//   if (count === 0) return { statusCode: 200, message: USERS_CONFIG.response.success.databaseCount, data: { total: 0 } };
//   if (!count) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

//   const allUsers = await this.userModel.countDocuments();
//   if (!allUsers) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);
//   // console.log((count * 100) / allUsers);
//   return { statusCode: 200, message: USERS_CONFIG.response.success.databaseCount, data: { total: (count * 100) / allUsers } };
// }

// WHATSAPP SVG ICON
//   <svg width={16} height={16} viewBox='0 0 32 32'>
//   <path
//     d='M25.873,6.069c-2.619-2.623-6.103-4.067-9.814-4.069C8.411,2,2.186,8.224,2.184,15.874c-.001,2.446,.638,4.833,1.852,6.936l-1.969,7.19,7.355-1.929c2.026,1.106,4.308,1.688,6.63,1.689h.006c7.647,0,13.872-6.224,13.874-13.874,.001-3.708-1.44-7.193-4.06-9.815h0Zm-9.814,21.347h-.005c-2.069,0-4.099-.557-5.87-1.607l-.421-.25-4.365,1.145,1.165-4.256-.274-.436c-1.154-1.836-1.764-3.958-1.763-6.137,.003-6.358,5.176-11.531,11.537-11.531,3.08,.001,5.975,1.202,8.153,3.382,2.177,2.179,3.376,5.077,3.374,8.158-.003,6.359-5.176,11.532-11.532,11.532h0Zm6.325-8.636c-.347-.174-2.051-1.012-2.369-1.128-.318-.116-.549-.174-.78,.174-.231,.347-.895,1.128-1.098,1.359-.202,.232-.405,.26-.751,.086-.347-.174-1.464-.54-2.788-1.72-1.03-.919-1.726-2.054-1.929-2.402-.202-.347-.021-.535,.152-.707,.156-.156,.347-.405,.52-.607,.174-.202,.231-.347,.347-.578,.116-.232,.058-.434-.029-.607-.087-.174-.78-1.88-1.069-2.574-.281-.676-.567-.584-.78-.595-.202-.01-.433-.012-.665-.012s-.607,.086-.925,.434c-.318,.347-1.213,1.186-1.213,2.892s1.242,3.355,1.416,3.587c.174,.232,2.445,3.733,5.922,5.235,.827,.357,1.473,.571,1.977,.73,.83,.264,1.586,.227,2.183,.138,.666-.1,2.051-.839,2.34-1.649,.289-.81,.289-1.504,.202-1.649s-.318-.232-.665-.405h0Z'
//     fill='#currentColor'
//   ></path>
// </svg>

// STATISTIC WITH CUSTOM NUMBER COUNTER, REPLACED WITH COUNTUP COMPONENT
// External components: https://ui.shadcn.com/docs/components
// import { Card, CardContent } from '@core/components/ui/card';
// // Components
// import { InfoCard } from '@core/components/common/InfoCard';
// import { LoadingDB } from '@core/components/common/LoadingDB';
// // External imports
// import { motion } from 'motion/react';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// // Imports
// import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// // React component
// export function Statistic({ children, content, error, isLoading, path, title, value1, value2 }: IStatistic) {
//   const targetNumber = value1?.toString();
//   const [displayedDigits, setDisplayedDigits] = useState<number[]>(new Array(targetNumber?.length).fill(0));
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   useEffect(() => {
//     if (targetNumber === undefined) return;

//     const counters = new Array(targetNumber.length).fill(0);
//     const timeouts: ReturnType<typeof setTimeout>[] = [];

//     function updateDigit(index: number) {
//       if (counters[index] < 30) {
//         setDisplayedDigits((prev) => {
//           const updatedDigits = [...prev];
//           updatedDigits[index] = randomNumber();
//           return updatedDigits;
//         });

//         counters[index]++;

//         if (counters[index] <= 20) {
//           timeouts[index] = setTimeout(() => updateDigit(index), 50);
//         } else {
//           const newDelay = 50 + (counters[index] - 20) * 30;
//           timeouts[index] = setTimeout(() => updateDigit(index), newDelay);
//         }
//       } else {
//         setDisplayedDigits((prev) => {
//           const updatedDigits = [...prev];
//           updatedDigits[index] = parseInt(targetNumber![index]);
//           return updatedDigits;
//         });

//         clearTimeout(timeouts[index]);
//       }
//     }

//     for (let i = 0; i < targetNumber.length; i++) {
//       updateDigit(i);
//     }

//     return () => timeouts.forEach((timeout) => clearTimeout(timeout));
//   }, [targetNumber]);

//   function randomNumber(): number {
//     return Math.floor(Math.random() * 10);
//   }

//   const animation = {
//     item: {
//       initial: { scale: 1, border: '1px solid transparent' },
//       animate: { scale: 1.05, border: '1px solid #e2e8f0', transition: { type: 'spring', stiffness: 800, damping: 20, duration: 0.2, delay: 0 } }, // slate-200
//     },
//   };

//   return (
//     <motion.button
//       className='rounded-lg'
//       onClick={() => path && navigate(path)}
//       initial='initial'
//       animate='initial'
//       whileHover='animate'
//       variants={animation.item}
//     >
//       <Card className='h-full'>
//         {isLoading ? (
//           <LoadingDB size='box' iconSize={32} empty className='relative top-1/2 -translate-y-1/2 p-6 py-6' />
//         ) : error ? (
//           <InfoCard text={error.message} type='error' className='relative top-1/2 -translate-y-1/2 p-6 text-xsm font-light text-dark-default' />
//         ) : (
//           <>
//             <section className='flex flex-row items-center justify-between p-4 pb-2'>
//               <span className='text-xsm font-semibold uppercase leading-none text-slate-700'>{t(title)}</span>
//               <div>{children}</div>
//             </section>
//             <CardContent className='space-y-2 p-4 pt-0'>
//               <div className='flex flex-row items-center text-3xl font-bold text-dark-default'>
//                 {displayedDigits.map((digit, index) => (
//                   <span key={index}>{digit}</span>
//                 ))}
//               </div>
//               <p className='text-left text-xs text-dark-default'>{t(content, { count: Number(value2) })}</p>
//             </CardContent>
//           </>
//         )}
//       </Card>
//     </motion.button>
//   );
// }

// DOT PATTERN COMPONENT
// <DotPattern
// glow={false}
// width={20}
// height={20}
// cx={1}
// cy={1}
// cr={.5}
// className={cn('px-3 pb-1 stroke-slate-300 [mask-image:radial-gradient(150px_circle_at_center,white,transparent)]')}
// // className={cn('[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]')}
// />