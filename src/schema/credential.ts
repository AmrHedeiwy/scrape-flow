import { z } from "zod";

export const CreateCredentialsSchema = z.object({
  name: z.string().min(1).max(30),
  value: z.string().min(1).max(500),
});

export type TCreateCredentialsSchema = z.infer<typeof CreateCredentialsSchema>;
