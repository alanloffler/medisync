import { z } from 'zod';
import { PROF_SCHEMA } from '@/pages/professionals/config/schemas.config';

const workingDaySchema = z.object({
  day: z.number(),
  value: z.boolean(),
});

let timeInit: string
let timeEnd: string;
let slotDuration: string;

export const professionalSchema = z.object({
  available: z.boolean({ message: PROF_SCHEMA.availableMessage }),
  area: z.string().min(1, { message: PROF_SCHEMA.areaMessage }),
  specialization: z.string().min(1, { message: PROF_SCHEMA.specializationMessage }),
  titleAbbreviation: z.string().min(1, { message: PROF_SCHEMA.titleAbbreviationMessage }),
  firstName: z.string().min(1, { message: PROF_SCHEMA.firstNameMessage }),
  lastName: z.string().min(1, { message: PROF_SCHEMA.lastNameMessage }),
  description: z.string().min(1, { message: PROF_SCHEMA.descriptionMessage }),
  dni: z.union([z.coerce.number().min(1, { message: PROF_SCHEMA.dniMessage }), z.string().min(1, { message: PROF_SCHEMA.dniMessage })]),
  email: z.string().email({ message: PROF_SCHEMA.emailMessage }),
  phone: z.union([z.coerce.number().min(1, { message: PROF_SCHEMA.phoneMessage }), z.string().min(1, { message: PROF_SCHEMA.phoneMessage })]),
  configuration: z.object({
    slotDuration: z.union([z.coerce.number().min(1, { message: PROF_SCHEMA.slotDurationMessage }), z.string().min(1, { message: PROF_SCHEMA.slotDurationMessage })]).superRefine((data) => {
      slotDuration = String(data);
    }),
    scheduleTimeInit: z
      .string()
      .min(1, { message: PROF_SCHEMA.scheduleTimeInitMessage })
      .superRefine((data, ctx) => {
        timeInit = data;
        const [hour, minutes] = data.split(':');

        if (parseInt(hour) < 0 || parseInt(hour) > 23 || hasHyphen(hour)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.minutesRange,
          });
        }
      }),
    scheduleTimeEnd: z
      .string()
      .min(1, { message: PROF_SCHEMA.scheduleTimeEndMessage })
      .superRefine((data, ctx) => {
        timeEnd = data;
        const [hour, minutes] = data.split(':');

        if (parseInt(hour) < 0 || parseInt(hour) > 23 || hasHyphen(hour)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.minutesRange,
          });
        }
        if (timeToMinutes(data) < timeToMinutes(timeInit, slotDuration)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.rangeError,
          });
        }
      }),
    timeSlotUnavailableInit: z
      .string()
      .min(1, { message: PROF_SCHEMA.timeSlotUnavailableInitMessage })
      .superRefine((data, ctx) => {
        const [hour, minutes] = data.split(':');

        if (parseInt(hour) < 0 || parseInt(hour) > 23 || hasHyphen(hour)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.minutesRange,
          });
        }
        // TODO: This is not working
        console.log(timeInit, timeEnd);
        if (timeToMinutes(data) > timeToMinutes(timeInit) && timeToMinutes(data) < timeToMinutes(timeEnd, slotDuration)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Inicio de descanso debe ser mayor a inicio de agenda',
          });
        }
      }),
    timeSlotUnavailableEnd: z
      .string()
      .min(1, { message: PROF_SCHEMA.timeSlotUnavailableEndMessage })
      .superRefine((data, ctx) => {
        const [hour, minutes] = data.split(':');

        if (parseInt(hour) < 0 || parseInt(hour) > 23 || hasHyphen(hour)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.minutesRange,
          });
        }
      }),
    workingDays: z.array(workingDaySchema).refine(
      (days) => {
        return days.some((day) => day.value === true);
      },
      { message: PROF_SCHEMA.workingDaysMessage },
    ),
  }),
});
// Convert time to minutes for validation
function timeToMinutes(time: string, slotDuration?: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  if (slotDuration) {
    return hours * 60 + minutes + parseInt(slotDuration);
  } else {
    return hours * 60 + minutes;
  }
}
// Validation if hour or minutes are not valid (empty value if has hyphen)
function hasHyphen(str: string): boolean {
  if (!str) return false;
  return str.includes('-');
}
