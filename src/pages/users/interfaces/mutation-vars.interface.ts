import { userSchema } from "@users/schemas/user.schema";
import { z } from "zod";

export interface IUpdateUserVars {
  id: string;
  data: z.infer<typeof userSchema>;
}