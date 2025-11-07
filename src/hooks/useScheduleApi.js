import { useCallback } from "react";
import api from "../api/config";

export default function useScheduleApi() {
  const fetchModuleSchedule = useCallback(async (moduleId, userId) => {
    const res = await api.get(`/api/schedule/module/${moduleId}/user/${userId}`);
    return res.data;
  }, []);

  const fetchUserSchedule = useCallback(async (userId) => {
    const res = await api.get(`/api/schedule/user/${userId}`);
    return res.data;
  }, []);

  const createSchedule = useCallback(async (payload) => {
    const res = await api.post(`/api/schedule/create`, payload);
    return res.data;
  }, []);

  const updateSchedule = useCallback(async (scheduleId, payload) => {
    const res = await api.put(`/api/schedule/${scheduleId}`, payload);
    return res.data;
  }, []);

  const deleteSchedule = useCallback(async (scheduleId) => {
    const res = await api.delete(`/api/schedule/${scheduleId}`);
    return res.data;
  }, []);

  return {
    fetchModuleSchedule,
    fetchUserSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
}
