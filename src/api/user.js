import axios from "axios";
import { API_BASE_URL } from "./config";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}//api/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error.response?.data || error.message;
  }
};
