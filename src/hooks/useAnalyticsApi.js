import { useCallback } from "react";
import api from "../api/config";

export default function useAnalyticsApi() {
  const getCourseOwnerDashboard = useCallback(async (userID) => {
    const res = await api.get(`/api/dashboard/owner/${userID}`);
    return res.data;
  }, []);

  return {
    getCourseOwnerDashboard,
  };
}
