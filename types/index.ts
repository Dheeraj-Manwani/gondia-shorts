export interface SessionUser {
  id: string;
  email?: string;
  name?: string;
  role?: "ADMIN" | "PUBLISHER" | "USER";
}
