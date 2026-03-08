import { axiosInstance } from '@/lib/axios';
import type { User, VerifyOtpResponse, CompleteRegistrationPayload } from '@/types/auth.types';

export const authApi = {
  async requestOtp(contact: string, channel: 'sms' | 'email'): Promise<{ success: true }> {
    const { data } = await axiosInstance.post('/auth/request-otp', { contact, channel });
    return data;
  },

  async verifyOtp(contact: string, otp: string): Promise<VerifyOtpResponse> {
    const { data } = await axiosInstance.post('/auth/verify-otp', { contact, otp });
    return data;
  },

  async completeRegistration(
    payload: CompleteRegistrationPayload,
  ): Promise<{ success: true; accessToken: string }> {
    const { data } = await axiosInstance.post('/auth/complete-registration', payload);
    return data;
  },

  async refreshToken(): Promise<{ success: true; accessToken: string }> {
    const { data } = await axiosInstance.post('/auth/refresh', {});
    return data;
  },

  async logout(): Promise<{ success: true }> {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
  },

  async getMe(): Promise<{ success: true; user: User }> {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },
};
