export interface UserProfile {
  birthYear: number | null;
  gender: string | null;
  country: string | null;
  updatedAt: string;
}

export interface User {
  id: string;
  phone: string | null;
  email: string | null;
  displayName: string;
  role: string;
  status: string;
  profile: UserProfile;
  capabilities: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export type VerifyOtpResponse =
  | { success: true; accessToken: string }
  | { success: true; registrationToken: string };

export interface CompleteRegistrationPayload {
  registrationToken: string;
  displayName: string;
  birthYear?: number | null;
  gender?: string | null;
  country?: string | null;
}
