import { useCallback } from "react";
import api from "../api/config";

export default function usePathwayApi() {
  const fetchAllPathways = useCallback(async () => {
    const res = await api.get("/api/pathway/getAll");
    return res.data;
  }, []);

  const fetchUserPathways = useCallback(async (userID) => {
    const res = await api.get(`/api/pathway/user/${userID}`);
    return res.data;
  }, []);

  const registerPathway = useCallback(async (payload) => {
    const res = await api.post("/api/pathway/register", payload);
    return res.data;
  }, []);

  const updatePathway = useCallback(async (pathwayID, payload) => {
    const res = await api.put(`/api/pathway/${pathwayID}`, payload);
    return res.data;
  }, []);

  return { fetchAllPathways, fetchUserPathways, registerPathway, updatePathway };
}