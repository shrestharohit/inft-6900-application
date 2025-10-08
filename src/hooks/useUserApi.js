import { useCallback } from "react";
import api from "../api/config";

export default function useUserApi() {
  const registerUser = useCallback(async (userData) => {
    const res = await api.post("/api/auth/register", userData);
    return res.data;
  }, []);

  const registerPriviledgedUser = useCallback(async (userData) => {
    const res = await api.post("/api/auth/register", userData);
    return res.data;
  }, []);

  const loginUser = useCallback(async (credentials) => {
    const res = await api.post("/api/auth/login", credentials);
    return res.data;
  }, []);

  const sendResetOTP = useCallback(async (email) => {
    const res = await api.post(
      "/api/auth/send-resetotp",
      { email },
      {
        withCredentials: true,
      }
    );
    return res.data;
  }, []);

  const verifyResetOTP = useCallback(async (email, otp) => {
    const res = await api.post(
      "/api/auth/verify-resetotp",
      { email, otpCode: otp },
      {
        withCredentials: true,
      }
    );
    return res.data;
  }, []);

  const resetPassword = useCallback(
    async ({ email, newPassword, confirmPassword }) => {
      const res = await api.post(
        "/api/auth/reset-password",
        {
          email,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    []
  );

  const getCurrentUser = useCallback(async (userId) => {
    const res = await api.get("/api/user/me", {
      headers: { "X-User-Id": userId },
    });
    return res.data.user;
  }, []);

  const updateUser = useCallback(async (userid, updateData) => {
    const res = await api.put("/api/user/me", updateData, {
      headers: { "X-User-Id": userid },
    });
    return res.data.user;
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    const res = await api.post("/api/auth/verify-otp", { email, otpCode: otp });
    return res.data;
  }, []);

  const resendOTP = useCallback(async (email) => {
    const res = await api.post("/api/auth/resend-otp", { email });
    return res.data;
  }, []);

  const fetchAllUsers = useCallback(async () => {
    const res = await api.get("/api/auth/users");
    return res.data.users || res.data;
  }, []);

  const deleteUserById = useCallback(async (userId) => {
    const res = await api.delete(`/api/auth/delete`, {
      data: { userID: userId },
    });
    return res.data;
  }, []);

  const updateUserById = useCallback(async (payload) => {
    const res = await api.put(`/api/auth/update`, payload);
    return res.data;
  }, []);

  return {
    registerUser,
    registerPriviledgedUser,
    fetchAllUsers,
    deleteUserById,
    updateUserById,
    loginUser,
    resetPassword,
    getCurrentUser,
    updateUser,
    verifyOTP,
    resendOTP,
    sendResetOTP,
    verifyResetOTP,
  };
}
