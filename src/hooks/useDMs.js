import { useCallback } from "react";
import api from "../api/config";

export default function useDms() {
  const createDms = useCallback(async (payload) => {
    const res = await api.post(`/api/dm/register`, payload);
    return res.data;
  }, []);

  const replyDms = useCallback(async (dmId, payload) => {
    const res = await api.put(`/api/dm/update/${dmId}`, payload);
    return res.data;
  }, []);

  const getAllDmsForCourse = useCallback(async (courseId) => {
    const res = await api.get(`/api/dm/course/${courseId}`);
    return res.data;
  }, []);

  const getAllDmsForUser = useCallback(async (userId) => {
    const res = await api.get(`/api/dm/user/${userId}`);
    return res.data;
  }, []);

  return {
    createDms,
    replyDms,
    getAllDmsForCourse,
    getAllDmsForUser,
  };
}
