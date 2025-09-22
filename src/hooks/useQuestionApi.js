import { useCallback } from 'react';
import api from '../api/config';

export default function useQuestionApi() {
  const registerQuestion = useCallback(async (courseID, moduleNumber, quizNumber, payload) => {
    const res = await api.post(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/register`, payload);
    return res.data;
  }, []);

  const updateQuestion = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber, payload) => {
    const res = await api.put(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}`, payload);
    return res.data;
  }, []);

  const fetchQuestion = useCallback(async (courseID, moduleNumber, quizNumber, questionNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/${questionNumber}`);
    return res.data;
  }, []);

  const fetchAllQuestions = useCallback(async (courseID, moduleNumber, quizNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question`);
    return res.data;
  }, []);

  const fetchQuestionMeta = useCallback(async (courseID, moduleNumber, quizNumber) => {
    const res = await api.get(`/api/course/${courseID}/module/${moduleNumber}/quiz/${quizNumber}/question/_meta`);
    return res.data;
  }, []);

  return { registerQuestion, updateQuestion, fetchQuestion, fetchAllQuestions, fetchQuestionMeta };
}
