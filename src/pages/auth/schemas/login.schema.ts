import { LOGIN_SCHEMA } from '@config/schemas/login-schema.config';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: LOGIN_SCHEMA.email.message }),
  password: z
    .string()
    .min(LOGIN_SCHEMA.password.min.value, { message: LOGIN_SCHEMA.password.min.message })
    .max(LOGIN_SCHEMA.password.max.value, { message: LOGIN_SCHEMA.password.max.message }),
});
