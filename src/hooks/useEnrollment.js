import { useCallback } from "react";
import api from "../api/config";

export default function useEnrollment() {
  const enrollCourse = useCallback(async (courseId, payload) => {
    const res = await api.post(`/api/enrolment/course/${courseId}`, payload);
    return res.data;
  }, []);

  const leaveCourse = useCallback(async (courseId, payload) => {
    const res = await api.put(
      `/api/enrolment/course/${courseId}/disenrol`,
      payload
    );
    return res.data;
  }, []);

  const getEnrolledCoursesById = useCallback(async (userId) => {
    const res = await api.get(`/api/enrolment/user/${userId}`);
    return res.data;
  }, []);

  return {
    enrollCourse,
    leaveCourse,
    getEnrolledCoursesById,
  };
}
