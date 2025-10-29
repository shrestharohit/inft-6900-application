import { useCallback } from "react";
import api from "../api/config";

export default function useContent() {
  const getContentDetails = useCallback(async (contentId) => {
    const res = await api.get(`/api/content/${contentId}`);
    return res.data;
  }, []);

  return {
    getContentDetails,
  };
}
