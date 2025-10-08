// src/Pages/CourseOwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // adjust path if needed
import { dummyCourses } from "../../Pages/dummyData";
import { dummyModules } from "../../Pages/dummyModule";

import {
  LineChart,
  Line,
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
import useAnalyticsApi from "../../hooks/useAnalyticsApi";

const COLORS = ["#1f2a60", "#4856a6", "#22c55e", "#f97316", "#e11d48"];

const CourseOwnerDashboardContent = () => {
  const { loggedInUser } = useAuth();
  const [ownerCourses, setOwnerCourses] = useState([]);

  const { getCourseOwnerDashboard } = useAnalyticsApi();

  useEffect(async () => {
    if (loggedInUser?.id) {
      const res = await getCourseOwnerDashboard(loggedInUser?.id);
      console.log("Dashboard data:", res);
      setOwnerCourses(res);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser?.email) {
      const courses = dummyCourses.filter(
        (c) => c.ownerEmail === loggedInUser.email
      );
      setOwnerCourses(courses);
    }
  }, [loggedInUser]);

  // Metrics
  const totalStudents = ownerCourses.reduce(
    (acc, c) => acc + (c.numEnrolled || 0),
    0
  );
  const avgRating =
    ownerCourses.length > 0
      ? (
          ownerCourses.reduce((acc, c) => acc + (c.rating || 0), 0) /
          ownerCourses.length
        ).toFixed(1)
      : 0;

  const announcementsCount = ownerCourses.reduce((acc, c) => {
    const published =
      JSON.parse(localStorage.getItem(`published_${c.id}`)) || [];
    return acc + published.length;
  }, 0);

  // Chart data
  const enrollmentData = ownerCourses.map((c) => ({
    name: c.name,
    enrolled: c.numEnrolled,
  }));

  const ratingData = ownerCourses.map((c) => ({
    name: c.name,
    rating: c.rating,
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
            {ownerCourses.length}
          </h2>
          <p className="text-gray-600">Courses Owned</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-green-600">{totalStudents}</h2>
          <p className="text-gray-600">Total Enrolled Students</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-yellow-500">{avgRating}</h2>
          <p className="text-gray-600">Average Rating</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-blue-600">
            {announcementsCount}
          </h2>
          <p className="text-gray-600">Announcements Published</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#1f2a60]">
            Enrollment per Course
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrolled" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#1f2a60]">
            Ratings per Course
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ratingData}
                dataKey="rating"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {ratingData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
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
              {ownerCourses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">{c.name}</td>
                  <td className="p-3 border">{c.numEnrolled}</td>
                  <td className="p-3 border">{c.rating}</td>
                  <td className="p-3 border">{c.releasedDate}</td>
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
