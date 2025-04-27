import { z } from "zod";

export const RoleEnum = z.enum(["USER", "PUBLISHER", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;
