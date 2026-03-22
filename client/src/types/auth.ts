export const UserRole = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

export interface ProfileFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
}
