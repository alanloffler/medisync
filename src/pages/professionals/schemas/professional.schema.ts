import { z } from 'zod';
import { PROF_SCHEMA } from '../config/schemas.config';

export const professionalSchema = z.object({
  available: z.boolean({ message: PROF_SCHEMA.availableMessage }),
  area: z.string().min(1, { message: PROF_SCHEMA.areaMessage }),
  specialization: z.string().min(1, { message: PROF_SCHEMA.specializationMessage }),
  titleAbbreviation: z.string().min(1, { message: PROF_SCHEMA.titleAbbreviationMessage }),
  firstName: z.string().min(1, { message: PROF_SCHEMA.firstNameMessage }),
  lastName: z.string().min(1, { message: PROF_SCHEMA.lastNameMessage }),
  email: z.string().email({ message: PROF_SCHEMA.emailMessage }),
  phone: z.union([z.coerce.number().min(1, { message: PROF_SCHEMA.phoneMessage }), z.string()]),
  configuration: z.object({
    scheduleTimeInit: z.string().min(2, { message: PROF_SCHEMA.scheduleTimeInitMessage }),
    scheduleTimeEnd: z.string().min(2, { message: PROF_SCHEMA.scheduleTimeEndMessage }),
    timeSlotUnavailableInit: z.string().min(2, { message: PROF_SCHEMA.timeSlotUnavailableInitMessage }),
    timeSlotUnavailableEnd: z.string().min(2, { message: PROF_SCHEMA.timeSlotUnavailableEndMessage }),
    workingDays: z.array(z.coerce.number()).nonempty().min(1, { message: PROF_SCHEMA.workingDaysMessage }),
  }),
});
