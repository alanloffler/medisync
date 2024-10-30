import { USER_SCHEMA } from '@config/schemas/user.schema';
import { z } from 'zod';

export const userSchema = z.object({
  dni: z.coerce
    .number()
    .min(USER_SCHEMA.dni.min.value, { message: USER_SCHEMA.dni.min.message })
    .max(USER_SCHEMA.dni.max.value, { message: USER_SCHEMA.dni.max.message }),

  email: z.string().email({ message: USER_SCHEMA.email.message }),

  firstName: z
    .string()
    .min(USER_SCHEMA.firstName.min.value, { message: USER_SCHEMA.firstName.min.message })
    .max(USER_SCHEMA.firstName.max.value, { message: USER_SCHEMA.firstName.max.message }),

  lastName: z
    .string()
    .min(USER_SCHEMA.lastName.min.value, { message: USER_SCHEMA.lastName.min.message })
    .max(USER_SCHEMA.lastName.max.value, { message: USER_SCHEMA.lastName.max.message }),

  phone: z.coerce
    .number()
    .min(USER_SCHEMA.phone.min.value, { message: USER_SCHEMA.phone.min.message })
    .max(USER_SCHEMA.phone.max.value, { message: USER_SCHEMA.phone.max.message }),
});
