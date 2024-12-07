import { EMAIL_SCHEMA } from '@config/schemas/email.schema';
import { z } from 'zod';

export const emailSchema = z.object({
  body: z
    .string({ message: EMAIL_SCHEMA.body.message })
    .min(EMAIL_SCHEMA.body.min.value, { message: EMAIL_SCHEMA.body.min.message })
    .max(EMAIL_SCHEMA.body.max.value, { message: EMAIL_SCHEMA.body.max.message }),

  subject: z
    .string({ message: EMAIL_SCHEMA.subject.message })
    .min(EMAIL_SCHEMA.subject.min.value, { message: EMAIL_SCHEMA.subject.min.message })
    .max(EMAIL_SCHEMA.subject.max.value, { message: EMAIL_SCHEMA.subject.max.message }),

  to: z
    .array(z.string({ message: EMAIL_SCHEMA.to.string }).email({ message: EMAIL_SCHEMA.to.email }))
    .nonempty({ message: EMAIL_SCHEMA.to.nonEmpty }),
});
