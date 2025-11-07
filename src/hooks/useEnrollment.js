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

  const getEnrolledCoursesForUser = useCallback(async (userId) => {
    const res = await api.get(`/api/enrolment/user/${userId}`);
    return res.data;
  }, []);

  const enrollInPathway = useCallback(async (pathwayId, payload) => {
    const res = await api.post(`/api/enrolment/pathway/${pathwayId}`, payload);
    return res.data;
  }, []);

  const leavePathway = useCallback(async (pathwayId, payload) => {
    const res = await api.put(
      `/api/enrolment/pathway/${pathwayId}/disenrol`,
      payload
    );
    return res.data;
  }, []);

  const getEnrolledPathwaysById = useCallback(async (userId) => {
    const res = await api.get(`/api/enrolment/user/${userId}`);
    return res.data.enrolments.filter((x) => !!x.pathwayID);
  }, []);

  return {
    enrollCourse,
    leaveCourse,
    getEnrolledCoursesById,
    getEnrolledCoursesForUser,
    enrollInPathway,
    leavePathway,
    getEnrolledPathwaysById,
  };
}
