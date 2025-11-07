import { useCallback } from "react";
import api from "../api/config";

export default function useReview() {
  const createReview = useCallback(async (payload) => {
    const res = await api.post(`/api/review/register`, payload);
    return res.data;
  }, []);

  const updateReview = useCallback(async (reviewId, payload) => {
    const res = await api.put(`/api/review/update/${reviewId}`, payload);
    return res.data;
  }, []);

  const getAllReviewsForCourse = useCallback(async (courseId) => {
    const res = await api.get(`/api/review/course/${courseId}`);
    return res.data;
  }, []);

  const deleteReviewById = useCallback(async (reviewId) => {
    const res = await api.delete(`/api/review/delete/${reviewId}`);
    return res.data;
  }, []);

  const getTop3Reviews = useCallback(async () => {
    const res = await api.get(`/api/review/topReviews`);
    return res.data;
  }, []);

  const getReviewsForAllCoursesUnderPathway = useCallback(async (pathwayId) => {
    const res = await api.get(`/api/review/pathway/${pathwayId}`);
    return res.data;
  }, []);

  return {
    createReview,
    updateReview,
    getAllReviewsForCourse,
    deleteReviewById,
    getTop3Reviews,
    getReviewsForAllCoursesUnderPathway,
  };
}
