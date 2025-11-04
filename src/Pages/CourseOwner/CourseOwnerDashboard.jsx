import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAnalyticsApi from "../../hooks/useAnalyticsApi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1f2a60", "#4856a6", "#22c55e", "#f97316", "#e11d48"];

const CourseOwnerDashboardContent = () => {
  const { loggedInUser } = useAuth();
  const [ownerCourses, setOwnerCourses] = useState([]);

  const { getCourseOwnerDashboard } = useAnalyticsApi();

  // ✅ Sydney-local date helpers
  const normalizeToDate = (ts) => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;

    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms);
    }

    if (typeof ts === "string") {
      let s = ts.trim();
      if (s.includes(" ") && !s.includes("T")) s = s.replace(" ", "T");
      // ⚠️ Do NOT add "Z" — treat as local Sydney time
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    const d = new Date(ts);
    return isNaN(d) ? null : d;
  };

  const formatDateTime = (ts) => {
    const date = normalizeToDate(ts);
    if (!date) return "";
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    let mounted = true;
    if (!loggedInUser?.id) return;
    getCourseOwnerDashboard(loggedInUser?.id)
      .then((res) => {
        if (mounted) {
          // ✅ Sort courses by release date (newest first)
          if (res?.individualCourseData?.length > 0) {
            res.individualCourseData.sort(
              (a, b) =>
                normalizeToDate(b.releasedDate) -
                normalizeToDate(a.releasedDate)
            );
          }
          setOwnerCourses(res);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
      });

    return () => (mounted = false);
  }, [getCourseOwnerDashboard, loggedInUser]);

  const enrollmentData = ownerCourses?.individualCourseData?.map((x) => ({
    name: x.title,
    enrolled: x.enrolments,
  }));

  const ratingData = ownerCourses?.individualCourseData?.map((x) => ({
    name: x.title,
    rating: x.avgRating,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Course Owner Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-[#1f2a60]">
            {ownerCourses?.overallData?.coursesOwned || 0}
          </h2>
          <p className="text-gray-600">Courses Owned</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-green-600">
            {ownerCourses?.overallData?.enrolments || 0}
          </h2>
          <p className="text-gray-600">Total Enrolled Students</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-yellow-500">
            {ownerCourses?.overallData?.avgRating || 0}
          </h2>
          <p className="text-gray-600">Average Rating</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-blue-600">
            {ownerCourses?.overallData?.totalPublishedAnnouncement || 0}
          </h2>
          <p className="text-gray-600">Announcements Published</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Enrollment as PIE */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#1f2a60]">
            Enrollment per Course
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={enrollmentData}
                dataKey="enrolled"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={90}
                label
              >
                {enrollmentData?.map((_, index) => (
                  <Cell
                    key={`enroll-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ratings as BAR */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#1f2a60]">
            Ratings per Course
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(t) =>
                  t?.length > 10 ? `${t.slice(0, 10)}…` : t
                }
              />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip formatter={(val) => Number(val).toFixed(1)} />
              <Bar dataKey="rating">
                {ratingData?.map((_, index) => (
                  <Cell
                    key={`rating-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-[#1f2a60]">
          Courses Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Course</th>
                <th className="p-3 border">Enrolled</th>
                <th className="p-3 border">Rating</th>
                <th className="p-3 border">Released</th>
              </tr>
            </thead>
            <tbody>
              {ownerCourses?.individualCourseData?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">{c.title}</td>
                  <td className="p-3 border">{c.enrolments}</td>
                  <td className="p-3 border">{c.avgRating}</td>
                  <td className="p-3 border">
                    {formatDateTime(c.releasedDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseOwnerDashboardContent;
