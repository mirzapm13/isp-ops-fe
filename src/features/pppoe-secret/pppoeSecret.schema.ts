import { z } from "zod";

export const pppoeSecretCreateSchema = z.object({
  name: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  comment: z.string().optional(),
  service: z.literal("pppoe"),
  profile: z.string().min(1, "Profile is required"),
  router: z.string().min(1, "Router is required"),
  disabled: z.enum(["yes", "no"]),
});

export type PppoeSecretCreateForm = z.infer<typeof pppoeSecretCreateSchema>;
