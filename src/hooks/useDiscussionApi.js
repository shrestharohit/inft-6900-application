import { useCallback } from 'react';
import api from '../api/config';

export default function useDiscussionApi() {
  const createPost = useCallback(async (courseId, payload) => {
    const res = await api.post(`/api/discussion/${courseId}/create`, payload);
    return res.data;
  }, []);

  const replyToPost = useCallback(async (postId, payload) => {
    const res = await api.post(`/api/discussion/reply/${postId}`, payload);
    return res.data;
  }, []);

  const fetchCoursePosts = useCallback(async (courseId) => {
    const res = await api.get(`/api/discussion/course/${courseId}`);
    return res.data;
  }, []);

  const updatePost = useCallback(async (postId, payload) => {
    const res = await api.put(`/api/discussion/update/${postId}`, payload);
    return res.data;
  }, []);

  const deletePost = useCallback(async (postId) => {
    const res = await api.delete(`/api/discussion/delete/${postId}`);
    return res.data;
  }, []);

  return { createPost, replyToPost, fetchCoursePosts, updatePost, deletePost };
}
