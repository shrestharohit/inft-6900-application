import axios from "axios";
import { API_BASE_URL } from "./config";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    return response.data; // ✅ return only .data
  } catch (error) {
    console.error("❌ Error in registerUser:", error.response?.data || error.message);
    throw error; // ✅ rethrow full error so frontend catch sees it
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error.response?.data || error.message;
  }
};
