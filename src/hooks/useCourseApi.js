import { useCallback } from 'react';
import api from '../api/config';

export default function useCourseApi() {
  const registerCourseOwner = useCallback(async (payload) => {
    const res = await api.post('/api/owner/register', payload);
    return res.data;
  }, []);

  const updateCourseOwner = useCallback(async (ownerID, payload) => {
    const res = await api.put(`/api/owner/${ownerID}`, payload);
    return res.data;
  }, []);

  const registerCourse = useCallback(async (payload) => {
    const res = await api.post('/api/course/register', payload);
    return res.data;
  }, []);

  const updateCourse = useCallback(async (courseID, payload) => {
    const res = await api.put(`/api/course/${courseID}`, payload);
    return res.data;
  }, []);

  const fetchCourse = useCallback(async (courseID) => {
    const res = await api.get(`/api/course/${courseID}`);
    return res.data;
  }, []);

  const fetchAllCourses = useCallback(async () => {
    const res = await api.get('/api/course');
    return res.data;
  }, []);

  const fetchAllModules = useCallback(async () => {
    const res = await api.get('/api/module/course/1');
    return res.data;
  }, []);

  const fetchCourseMeta = useCallback(async () => {
    const res = await api.get('/api/course/_meta');
    return res.data;
  }, []);

  const fetchCourseCategories = useCallback(async () => {
    const res = await api.get('/api/course/categories');
    return res.data;
  }, []);

  const fetchPopularCoursesAndPathway = useCallback(async () => {
    const res = await api.get('/api/enrolment/popular');
    return res.data;
  }, []);

  return {
    registerCourseOwner,
    updateCourseOwner,
    registerCourse,
    updateCourse,
    fetchCourse,
    fetchAllCourses,
    fetchAllModules,
    fetchCourseMeta,
    fetchCourseCategories,
    fetchPopularCoursesAndPathway
  };
}
