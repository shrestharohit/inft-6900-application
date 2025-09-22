import { useCallback } from 'react';
import api from '../api/config';

export default function useUserApi() {
  const registerUser = useCallback(async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    return res.data;
  }, []);

  const loginUser = useCallback(async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
  }, []);

  const resetPassword = useCallback(async ({ email, newPassword, confirmPassword }) => {
    const res = await api.post('/api/auth/reset-password', { email, newPassword, confirmPassword });
    return res.data;
  }, []);

  const getCurrentUser = useCallback(async (userId) => {
    const res = await api.get('/api/auth/user', { headers: { userId } });
    return res.data.user;
  }, []);

  const updateUser = useCallback(async (userId, updateData) => {
    const res = await api.put('/api/auth/user', updateData, { headers: { userId } });
    return res.data.user;
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    const res = await api.post('/api/auth/verify-otp', { email, otpCode: otp });
    return res.data;
  }, []);

  const resendOTP = useCallback(async (email) => {
    const res = await api.post('/api/auth/resend-otp', { email });
    return res.data;
  }, []);

  return {
    registerUser,
    loginUser,
    resetPassword,
    getCurrentUser,
    updateUser,
    verifyOTP,
    resendOTP,
  };
}
