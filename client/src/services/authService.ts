import type { ProfileFormData, User } from "@/types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000/api/v1";

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface SaveProfileResponse {
  success: boolean;
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

function mapBackendUserToClientUser(backendUser: {
  id: string;
  name: string;
  email: string;
}): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
  };
}

/**
 * Save user profile for first-time users.
 * Replace the mock implementation with a real API call.
 */
export async function saveProfile(
  token: string,
  profileData: ProfileFormData
): Promise<SaveProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = errorText || "Failed to save profile";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to save profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save profile";
    throw new Error(errorMessage);
  }
}
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const errorMessage = errorJson?.message || "Invalid credentials";
      throw new Error(errorMessage);
    }

    const res = await response.json();
    return {
      token: res.data.access_token,
      user: mapBackendUserToClientUser(res.data.user),
    };
  } catch (error) {
    console.error("Login failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    throw new Error(errorMessage);
  }
}

/**
 * Register with full name, email, and password.
 * Replace the mock implementation with a real API call.
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const errorMessage = errorJson?.message || "Registration failed";
      throw new Error(errorMessage);
    }

    const res = await response.json();
    return {
      token: res.data.access_token,
      user: mapBackendUserToClientUser(res.data.user),
    };
  } catch (error) {
    console.error("Registration failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    throw new Error(errorMessage);
  }
}
