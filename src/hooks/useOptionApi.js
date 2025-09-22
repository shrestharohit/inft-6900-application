import { useCallback } from 'react';
import api from '../api/config';

export default function useOptionApi() {
  const registerOption = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber, payload) => {
    const res = await api.post(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}/option/register`, payload);
    return res.data;
  }, []);

  const updateOption = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber, optionNumber, payload) => {
    const res = await api.put(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}/option/${optionNumber}`, payload);
    return res.data;
  }, []);

  const fetchOption = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber, optionNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}/option/${optionNumber}`);
    return res.data;
  }, []);

  const fetchAllOptions = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}/option`);
    return res.data;
  }, []);

  const fetchOptionAnswer = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}/option/answer`);
    return res.data;
  }, []);

  const fetchOptionMeta = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}/option/_meta`);
    return res.data;
  }, []);

  return { registerOption, updateOption, fetchOption, fetchAllOptions, fetchOptionAnswer, fetchOptionMeta };
}
