import { useMutation } from "@tanstack/react-query";
import {
  saveProfile,
  login,
  register,
} from "@/services/authService";
import type {
  SaveProfileResponse,
  LoginResponse,
  RegisterResponse,
} from "@/services/authService";
import type { ProfileFormData } from "@/types/auth";

/**
 * Mutation hook for requesting OTP.
 */
/**
 * Mutation hook for saving user profile.
 */
export function useSaveProfile() {
  return useMutation<
    SaveProfileResponse,
    Error,
    { token: string; profileData: ProfileFormData }
  >({
    mutationFn: ({ token, profileData }) => saveProfile(token, profileData),
  });
}

/**
 * Mutation hook for login.
 */
export function useLogin() {
  return useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => login(email, password),
  });
}

/**
 * Mutation hook for register.
 */
export function useRegister() {
  return useMutation<
    RegisterResponse,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationFn: ({ name, email, password }) => register(name, email, password),
  });
}
