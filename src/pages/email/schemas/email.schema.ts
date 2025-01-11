import { z } from 'zod';

export const emailSchema = z.object({
  body: z
    .string()
    .min(5, { message: 'schema.email.min.body' })
    .max(1000, { message: 'schema.email.max.body' }),
  subject: z
    .string()
    .min(5, { message: 'schema.email.min.subject' })
    .max(100, { message: 'schema.email.max.subject' }),
  to: z
    .string()
    .email({ message: 'schema.email.invalid' })
    .array()
    .nonempty({ message: 'schema.email.nonEmpty.to' }),
});
