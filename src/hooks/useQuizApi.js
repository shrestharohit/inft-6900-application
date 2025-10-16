import { useCallback } from "react";
import api from "../api/config";

export default function useQuizApi() {
  const registerQuiz = useCallback(async (payload) => {
    const res = await api.post(`/api/quiz/register`, payload);
    return res.data;
  }, []);

  const updateQuiz = useCallback(async (quizId, payload) => {
    const res = await api.put(`/api/quiz/update/${quizId}`, payload);
    return res.data;
  }, []);

  const fetchQuizApprovalList = useCallback(async () => {
    const res = await api.get(`/api/quiz/approval-list`);
    return res.data;
  }, []);

  const fetchQuizForCourseOwner = useCallback(async (userId) => {
    const res = await api.get(`/api/quiz/owner/${userId}`);
    return res.data;
  }, []);

  const fetchAllQuizzes = useCallback(async (courseID, moduleNumber) => {
    const res = await api.get(
      `/api/course/${courseID}/module/${moduleNumber}/quiz`
    );
    return res.data;
  }, []);

  const fetchQuizMeta = useCallback(async (courseID, moduleNumber) => {
    const res = await api.get(
      `/api/course/${courseID}/module/${moduleNumber}/quiz/_meta`
    );
    return res.data;
  }, []);

  const fetchQuizForCourse = useCallback(async (courseId) => {
    const res = await api.get(`/api/quiz/course/${courseId}`);
    return res.data;
  }, []);

  const startQuiz = useCallback(async (quizId, payload) => {
    const res = await api.post(`/api/quiz/${quizId}/start`, payload);
    return res.data;
  }, []);

  const submitQuiz = useCallback(async (quizId, payload) => {
    const res = await api.put(`/api/quiz/${quizId}/submit`, payload);
    return res.data;
  }, []);

  const getQuizResultForUser = useCallback(async (quizId, userId) => {
    const res = await api.get(`/api/quiz/${quizId}/user/${userId}`);
    return res.data;
  }, []);

  return {
    registerQuiz,
    updateQuiz,
    fetchQuizApprovalList,
    fetchQuizForCourseOwner,
    fetchAllQuizzes,
    fetchQuizMeta,
    fetchQuizForCourse,
    startQuiz,
    submitQuiz,
    getQuizResultForUser,
  };
}
