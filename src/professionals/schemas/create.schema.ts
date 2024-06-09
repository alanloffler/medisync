import { z } from 'zod';
import { PROF_CREATE_SCHEMA } from '../config/schemas.config';

export const createSchema = z.object({
  available: z.coerce.number().min(1, { message: PROF_CREATE_SCHEMA.availableMessage }),
  area: z.string().min(1, { message: PROF_CREATE_SCHEMA.areaMessage }),
  specialization: z.string().min(1, { message: PROF_CREATE_SCHEMA.specializationMessage }),
  titleAbbreviation: z.string().min(1, { message: PROF_CREATE_SCHEMA.titleAbbreviationMessage }),
  firstName: z.string().min(1, { message: PROF_CREATE_SCHEMA.firstNameMessage }),
  lastName: z.string().min(1, { message: PROF_CREATE_SCHEMA.lastNameMessage }),
  email: z.string().email({ message: PROF_CREATE_SCHEMA.emailMessage }),
  phone: z.union([z.coerce.number().min(1, { message: PROF_CREATE_SCHEMA.phoneMessage }), z.string()]),
});
