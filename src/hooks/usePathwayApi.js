import { useCallback } from "react";
import api from "../api/config";

export default function usePathwayApi() {
    const fetchAllPathways = useCallback(async () => {
        const res = await api.get("/api/pathway/getAll");
        return res.data;
    }, []);
    return { fetchAllPathways };
}