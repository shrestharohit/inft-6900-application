import { useCallback } from "react";
import api from "../api/config";

export default function useAnnouncement() {
  const createAnnouncement = useCallback(async (courseId, payload) => {
    const res = await api.post(
      `/api/announcement/${courseId}/register`,
      payload
    );
    return res.data;
  }, []);

  const updateAnnouncement = useCallback(async (announcementId, payload) => {
    const res = await api.put(
      `/api/announcement/update/${announcementId}`,
      payload
    );
    return res.data;
  }, []);

  const getAllAnnouncementsForCourse = useCallback(async (courseId) => {
    const res = await api.get(`/api/announcement/${courseId}/getAll`);
    return res.data;
  }, []);

  const deleteAnnouncementById = useCallback(async (announcementId) => {
    const res = await api.delete(`/api/announcement/delete/${announcementId}`);
    return res.data;
  }, []);

  return {
    createAnnouncement,
    updateAnnouncement,
    getAllAnnouncementsForCourse,
    deleteAnnouncementById,
  };
}
