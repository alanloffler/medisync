import { z } from 'zod';
import { PROF_SCHEMA } from '@/pages/professionals/config/schemas.config';

const workingDaySchema = z.object({
  day: z.number(),
  value: z.boolean(),
});

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
    scheduleTimeInit: z
      .string()
      .min(1, { message: PROF_SCHEMA.scheduleTimeInitMessage })
      .superRefine((data, ctx) => {
        if (parseInt(data.split(':')[0]) < 0 || parseInt(data.split(':')[0]) > 23) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(data.split(':')[1]) < 0 || parseInt(data.split(':')[1]) > 59) {
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
        if (parseInt(data.split(':')[0]) < 0 || parseInt(data.split(':')[0]) > 23) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(data.split(':')[1]) < 0 || parseInt(data.split(':')[1]) > 59) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.minutesRange,
          });
        }
      }),
    slotDuration: z.union([z.coerce.number().min(1, { message: PROF_SCHEMA.slotDurationMessage }), z.string().min(1, { message: PROF_SCHEMA.slotDurationMessage })]),
    timeSlotUnavailableInit: z
      .string()
      .min(1, { message: PROF_SCHEMA.timeSlotUnavailableInitMessage })
      .superRefine((data, ctx) => {
        if (parseInt(data.split(':')[0]) < 0 || parseInt(data.split(':')[0]) > 23) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(data.split(':')[1]) < 0 || parseInt(data.split(':')[1]) > 59) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.minutesRange,
          });
        }
      }),
    timeSlotUnavailableEnd: z
      .string()
      .min(1, { message: PROF_SCHEMA.timeSlotUnavailableEndMessage })
      .superRefine((data, ctx) => {
        if (parseInt(data.split(':')[0]) < 0 || parseInt(data.split(':')[0]) > 23) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PROF_SCHEMA.inputMask.hourRange,
          });
        }
        if (parseInt(data.split(':')[1]) < 0 || parseInt(data.split(':')[1]) > 59) {
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

// function validateSlot(value: string): boolean {
//   const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
//   const slotFormat: boolean = regex.test(value);
//   const hour: boolean = parseInt(value.split(':')[0]) >= 0 && parseInt(value.split(':')[0]) <= 23;
//   const minutes: boolean = parseInt(value.split(':')[1]) >= 0 && parseInt(value.split(':')[1]) <= 59;

//   return slotFormat && hour && minutes;
// }
