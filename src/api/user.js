import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      userData
    );
    return response.data; // ✅ return only .data
  } catch (error) {
    console.error(
      "❌ Error in registerUser:",
      error.response?.data || error.message
    );
    throw error; // ✅ rethrow full error so frontend catch sees it
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async ({
  email,
  newPassword,
  confirmPassword,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/reset-password`,
      {
        email,
        newPassword,
        confirmPassword,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error in resetPassword:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const getCurrentUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/api/auth/user`, {
    headers: { userId }, // backend expects userId header
  });
  return response.data.user;
};

export const updateUser = async (userId, updateData) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/auth/user`,
    updateData,
    {
      headers: { userId },
    }
  );
  return response.data.user;
};

export const verifyOTP = async (email, otp) => {
  const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
    email,
    otpCode: otp,
  });

  return res;
};
