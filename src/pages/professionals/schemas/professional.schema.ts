import { z } from 'zod';
import { PROF_SCHEMA } from '@professionals/config/schemas.config';

const workingDaySchema = z.object({
  day: z.number(),
  value: z.boolean(),
});

let slotDuration: string;
let timeInit: string;
let timeEnd: string;
let timeSlotUnavailableInit: string | undefined;
let timeSlotUnavailableEnd: string | undefined;

export const professionalSchema = z.object({
  available: z.boolean({ message: PROF_SCHEMA.availableMessage }),
  area: z.string().min(1, { message: PROF_SCHEMA.areaMessage }),
  specialization: z.string().min(1, { message: PROF_SCHEMA.specializationMessage }),
  title: z.string().min(1, { message: PROF_SCHEMA.titleAbbreviationMessage }),
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
            message: PROF_SCHEMA.configuration.common.hourRange,
          });
        }
        if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.configuration.common.minutesRange,
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
            message: PROF_SCHEMA.configuration.common.hourRange,
          });
        }
        if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.configuration.common.minutesRange,
          });
        }
        if (timeToMinutes(data) < timeToMinutes(timeInit, slotDuration)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.rangeError,
          });
        }
      }),
    // Unavailable time slot
    unavailableTimeSlot: z
      .object({
        timeSlotUnavailableInit: z.string().superRefine((data, ctx) => {
          if (data) {
            data === '--:--' ? (timeSlotUnavailableInit = undefined) : (timeSlotUnavailableInit = data);
            const [hour, minutes] = data.split(':');
            // Hour format validation (00-23)
            if (parseInt(hour) < 0 || parseInt(hour) > 23 || hasHyphen(hour)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.common.hourRange,
              });
            }
            // Minutes format validation (00-59)
            if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.common.minutesRange,
              });
            }
            // Slot time greater than schedule time init plus one slot duration
            if (timeToMinutes(data) < timeToMinutes(timeInit, slotDuration)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.unavailableTimeSlot.timeInit.greaterThanTimeInit,
              });
            }
            // Slot time less than schedule time end minus one slot duration
            if (timeToMinutes(data) > timeToMinutesLess(timeEnd, slotDuration)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.unavailableTimeSlot.timeInit.lessThanTimeEnd,
              });
            }
          }
        }),
        timeSlotUnavailableEnd: z.string().superRefine((data, ctx) => {
          if (data) {
            data === '--:--' ? (timeSlotUnavailableEnd = undefined) : (timeSlotUnavailableEnd = data);
            const [hour, minutes] = data.split(':');
            // Hour format validation (00-23)
            if (parseInt(hour) < 0 || parseInt(hour) > 23 || hasHyphen(hour)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.common.hourRange,
              });
            }
            // Minutes format validation (00-59)
            if (parseInt(minutes) < 0 || parseInt(minutes) > 59 || hasHyphen(minutes)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.common.minutesRange,
              });
            }
            // Slot time greater than schedule time init plus one slot duration
            if (timeToMinutes(data) < timeToMinutes(timeInit, slotDuration)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.unavailableTimeSlot.timeInit.greaterThanTimeInit,
              });
            }
            // Slot time less than schedule time end minus one slot duration
            if (timeToMinutes(data) > timeToMinutesLess(timeEnd, slotDuration)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.unavailableTimeSlot.timeInit.lessThanTimeEnd,
              });
            }
          } else {
            if (timeSlotUnavailableInit !== undefined) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PROF_SCHEMA.configuration.unavailableTimeSlot.timeEnd.required,
              });
            }
          }
        }),
      })
      .optional()
      .superRefine((_, ctx) => {
        // Unavailable time init must be less than time end
        if (timeSlotUnavailableEnd && timeSlotUnavailableInit && timeToMinutes(timeSlotUnavailableInit) > timeToMinutes(timeSlotUnavailableEnd)) {
          ctx.addIssue({
            path: ['timeSlotUnavailableInit'],
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.configuration.unavailableTimeSlot.common.lessThanUnavailableTimeEnd,
          });
        }
        // Unavailable time end must be greater than time init
        if (timeSlotUnavailableEnd && timeSlotUnavailableInit && timeToMinutes(timeSlotUnavailableEnd) < timeToMinutes(timeSlotUnavailableInit)) {
          ctx.addIssue({
            path: ['timeSlotUnavailableEnd'],
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.configuration.unavailableTimeSlot.common.greaterThanUnavailableTimeInit,
          });
        }
        // Unavailable time init and unavailable time end must be different
        if (timeSlotUnavailableEnd && timeSlotUnavailableInit && timeToMinutes(timeSlotUnavailableEnd) === timeToMinutes(timeSlotUnavailableInit)) {
          ctx.addIssue({
            path: ['timeSlotUnavailableEnd'],
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.configuration.unavailableTimeSlot.common.different,
          });
          ctx.addIssue({
            path: ['timeSlotUnavailableInit'],
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.configuration.unavailableTimeSlot.common.different,
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

function timeToMinutesLess(time: string, slotDuration: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes - parseInt(slotDuration);
}
// Validation if hour or minutes are not valid (empty value if has hyphen)
function hasHyphen(str: string): boolean {
  if (!str) return false;
  return str.includes('-');
}
