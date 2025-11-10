import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import useAnalyticsApi from "../../hooks/useAnalyticsApi";

const COLORS = ["#1f2a60", "#22c55e", "#f97316", "#e11d48"];

export default function AdminDashboard() {
  const { getAdminDashboard } = useAnalyticsApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    totalUserCount = 0,
    newUserCount = 0,
    studentCount = 0,
    courseOwnerCount = 0,
    adminCount = 0,
    pendingCourseCount = 0,
    activeCourseCount = 0,
    enrolments = [],
    newUsers = [],
  } = data || {};

  // ✅ Hooks must always run (even before data is ready)
  const roleData = useMemo(
    () => [
      { name: "Students", value: studentCount },
      { name: "Course Owners", value: courseOwnerCount },
      { name: "Admins", value: adminCount },
    ],
    [studentCount, courseOwnerCount, adminCount]
  );

  const pendingData = useMemo(
    () => [
      { name: "Courses", value: pendingCourseCount },
      { name: "ActiveCourses", value: activeCourseCount },
    ],
    [pendingCourseCount, activeCourseCount]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAdminDashboard();
        if (mounted) setData(res || {});
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
        if (mounted) setError("Failed to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [getAdminDashboard]);

  // ✅ Conditional returns now AFTER hooks
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto animate-pulse space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">🛡️ Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-rose-600 mb-4">Admin Dashboard</h1>
        <div className="bg-white border border-rose-200 text-rose-700 rounded p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🛡️ Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Users" value={totalUserCount} color="#1f2a60" />
        <KpiCard title="New Users" value={newUserCount} color="#22c55e" />
        <KpiCard title="Active Courses" value={activeCourseCount} color="#f97316" />
        <KpiCard title="Pending Courses" value={pendingCourseCount} color="#e11d48"/>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Users by Role */}
        <Card title="User Distribution by Role">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={3}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // ✅ Only percentage
                labelLine={false}
              >
                {roleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                contentStyle={{ borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* ✅ Legend with names + counts */}
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-700 flex-wrap">
            {roleData.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 inline-block rounded-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></span>
                {r.name} ({r.value})
              </div>
            ))}
          </div>
        </Card>



        {/* Course Engagement Overview */}
        <Card title="Course Engagement Overview">
          <ResponsiveContainer width="100%" height={320}>
            {/* <BarChart
              data={enrolments || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="courseName"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-40}
                textAnchor="end"
                height={90}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => [`${value}`, name.replace("Count", "")]}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="enrolledCount" stackId="a" fill="#3b82f6" name="Enrolled" />
              <Bar
                dataKey="inProgressCount"
                stackId="a"
                fill="#f97316"
                name="In Progress"
              />
              <Bar
                dataKey="completedCount"
                stackId="a"
                fill="#22c55e"
                name="Completed"
              />
              <Bar
                dataKey="disenrolledCount"
                stackId="a"
                fill="#e11d48"
                name="Disenrolled"
              />
            </BarChart> */}

            <BarChart
              layout="vertical"
              data={enrolments || []}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="courseName"
                type="category"
                tick={{ fontSize: 11 }}
                tickMargin={4}
                width={160} // adjust if needed
              />


              <Tooltip
                formatter={(value, name) => [`${value}`, name.replace("Count", "")]}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "12px" }}
              />

              {/* Stacked bars for status counts */}
              <Bar dataKey="enrolledCount" stackId="a" fill="#1f2a60" name="Enrolled" />
              <Bar dataKey="inProgressCount" stackId="a" fill="#f97316" name="In Progress" />
              <Bar dataKey="completedCount" stackId="a" fill="#22c55e" name="Completed" />
              <Bar dataKey="disenrolledCount" stackId="a" fill="#e11d48" name="Disenrolled" />
            </BarChart>

          </ResponsiveContainer>
        </Card>

      </div>

      {/* Recent Users */}
      <Card title="Newly Registered Users">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Verified</th>
                <th className="p-3 border">Joined</th>
              </tr>
            </thead>
            <tbody>
              {newUsers.length > 0 ? (
                newUsers.map((u) => (
                  <tr key={u.userID} className="hover:bg-gray-50">
                    <td className="p-3 border font-medium">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3 border">{u.email}</td>
                    <td className="p-3 border capitalize">{u.role}</td>
                    <td
                      className={`p-3 border ${u.isEmailVerified
                          ? "text-green-600"
                          : "text-rose-600 font-medium"
                        }`}
                    >
                      {u.isEmailVerified ? "Yes" : "No"}
                    </td>
                    <td className="p-3 border">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No new users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function KpiCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold" style={{ color }}>
        {value}
      </h2>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-[#1f2a60]">{title}</h2>
      {children}
    </div>
  );
}
