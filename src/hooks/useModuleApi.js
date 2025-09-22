import { useCallback } from 'react';
import api from '../api/config';

export default function useModuleApi() {
  const registerModule = useCallback(async (courseID, payload) => {
    const res = await api.post(`/api/course/${courseID}/module/register`, payload);
    return res.data;
  }, []);

  const updateModule = useCallback(async (courseID, moduleNumber, payload) => {
    const res = await api.put(`/api/course/${courseID}/module/${moduleNumber}`, payload);
    return res.data;
  }, []);

  const fetchModule = useCallback(async (courseID, moduleNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}`);
    return res.data;
  }, []);

  const fetchAllModules = useCallback(async (courseID) => {
    const res = await api.get(`/api/course/${courseID}/module`);
    return res.data;
  }, []);

  const fetchModuleMeta = useCallback(async (courseID) => {
    const res = await api.get(`/api/course/${courseID}/module/_meta`);
    return res.data;
  }, []);

  return { registerModule, updateModule, fetchModule, fetchAllModules, fetchModuleMeta };
}
