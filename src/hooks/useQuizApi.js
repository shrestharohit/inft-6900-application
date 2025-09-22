import { useCallback } from 'react';
import api from '../api/config';

export default function useQuizApi() {
  const registerQuiz = useCallback(async (courseID, moduleNumber, payload) => {
    const res = await api.post(`/api/course/${courseID}/module/${moduleNumber}/quiz/register`, payload);
    return res.data;
  }, []);

  const updateQuiz = useCallback(async (courseID, moduleNumber, quizNumber, payload) => {
    const res = await api.put(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}`, payload);
    return res.data;
  }, []);

  const fetchQuiz = useCallback(async (courseID, moduleNumber, quizNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}`);
    return res.data;
  }, []);

  const fetchAllQuizzes = useCallback(async (courseID, moduleNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz`);
    return res.data;
  }, []);

  const fetchQuizMeta = useCallback(async (courseID, moduleNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/_meta`);
    return res.data;
  }, []);

  return { registerQuiz, updateQuiz, fetchQuiz, fetchAllQuizzes, fetchQuizMeta };
}
