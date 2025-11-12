import { useCallback } from "react";
import api from "../api/config";

export default function useAnalyticsApi() {
  //Course Owner 
  const getCourseOwnerDashboard = useCallback(async (userID) => {
    const res = await api.get(`/api/dashboard/owner/${userID}`);
    return res.data;
  }, []);

  // Admin
  const getAdminDashboard = useCallback(async () => {
    try {
      const res = await api.get(`/api/dashboard/admin`);
      return res.data;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[useAnalyticsApi] /api/dashboard/admin not ready — using mock.");
        return mockAdminDashboard();
      }
      throw err;
    }
  }, []);

  return {
    getCourseOwnerDashboard,
    getAdminDashboard,
  };
}

function mockAdminDashboard() {
  const today = new Date();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return {
      date: d.toISOString().slice(0, 10),
      count: Math.max(0, Math.round(10 + 8 * Math.sin(i / 5) + (Math.random() * 6 - 3))),
    };
  });

  return {
    overall: {
      totalUsers: 1350,
      newUsers7d: 82,
      activeUsers30d: 640,
      pendingCourseApprovals: 3,
      pendingQuizApprovals: 5,
    },
    timeseries: { dailySignups: days },
    usersByRole: [
      { role: "Learner", count: 1200 },
      { role: "Owner", count: 145 },
      { role: "Admin", count: 5 },
    ],
    approvalsSnapshot: [
      { type: "Courses", pending: 3, approved: 120, rejected: 5 },
      { type: "Quizzes", pending: 5, approved: 210, rejected: 9 },
    ],
    latestUsers: [
      { name: "Aisha Khan", email: "aisha@example.com", role: "Learner", joinedAt: "2025-10-09" },
      { name: "Marco Li", email: "marco@example.com", role: "Owner", joinedAt: "2025-10-08" },
      { name: "Sara Ahmed", email: "sara@example.com", role: "Learner", joinedAt: "2025-10-08" },
    ],
  };
}
