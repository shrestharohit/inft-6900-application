import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import useAnalyticsApi from "../../hooks/useAnalyticsApi";

const COLORS = ["#1f2a60", "#22c55e", "#f97316", "#4856a6", "#e11d48"];

export default function AdminDashboard() {
  const { getAdminDashboard } = useAnalyticsApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getAdminDashboard();
        if (mounted) setData(res || {});
      } catch (e) {
        console.error("Failed to load admin dashboard", e);
        if (mounted) setErr("Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [getAdminDashboard]);

  // ---------- Safe getters / fallbacks ----------
  const overall = data?.overall || {};

  // Memoize/chart-friendly transforms + coercions
  const dailySignups = useMemo(
    () =>
      (data?.timeseries?.dailySignups || []).map((d, i) => ({
        // keep original date string but ensure count is a number
        date: d?.date || String(i),
        count: Number(d?.count ?? 0),
      })),
    [data]
  );

  const roles = useMemo(
    () =>
      (data?.usersByRole || []).map((r, i) => ({
        role: r?.role || `Role ${i + 1}`,
        count: Number(r?.count ?? 0),
      })),
    [data]
  );

  const approvals = useMemo(
    () =>
      (data?.approvalsSnapshot || []).map((a, i) => ({
        type: a?.type || `Type ${i + 1}`,
        pending: Number(a?.pending ?? 0),
        approved: Number(a?.approved ?? 0),
        rejected: Number(a?.rejected ?? 0),
      })),
    [data]
  );

  const latestUsers = useMemo(
    () =>
      (data?.latestUsers || []).map((u, i) => ({
        id: `${u?.email || u?.name || i}-${i}`,
        name: u?.name || "—",
        email: u?.email || "—",
        role: u?.role || "—",
        joinedAt: u?.joinedAt || "—",
      })),
    [data]
  );

  const needsAttention = [
    {
      label: "Course Approvals",
      value: Number(overall.pendingCourseApprovals ?? 0),
      onClick: () => navigate("/admin/course-approvals"),
    },
    {
      label: "Quiz Approvals",
      value: Number(overall.pendingQuizApprovals ?? 0),
      onClick: () => navigate("/admin/quiz-approvals"),
    },
  ];

  const formatShortDate = (iso) => {
    // expects YYYY-MM-DD; fallback to raw string if parsing fails
    if (!iso || typeof iso !== "string" || iso.length < 10) return iso || "";
    // show as DD Mon (e.g., 05 Oct)
    const [y, m, d] = iso.split("-");
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(m) - 1] || "";
    return `${d} ${month}`;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-56 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-lg shadow" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-72 bg-white rounded-lg shadow" />
            <div className="h-72 bg-white rounded-lg shadow" />
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-rose-600 mb-4">Admin Dashboard</h1>
        <div className="bg-white border border-rose-200 text-rose-700 rounded p-4">
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🛡️ Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <KpiCard title="Total Users" value={Number(overall.totalUsers ?? 0)} color="#1f2a60" />
        <KpiCard title="New (7d)" value={Number(overall.newUsers7d ?? 0)} color="#22c55e" />
        <KpiCard title="Active (30d)" value={Number(overall.activeUsers30d ?? 0)} color="#4856a6" />
        <KpiCard title="Pending Courses" value={Number(overall.pendingCourseApprovals ?? 0)} color="#f97316" />
        <KpiCard title="Pending Quizzes" value={Number(overall.pendingQuizApprovals ?? 0)} color="#e11d48" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Signups Line */}
        <Card title="Daily Signups (Last 30 days)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailySignups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={formatShortDate}
                minTickGap={20}
              />
              <YAxis allowDecimals={false} />
              <Tooltip labelFormatter={(v) => v} />
              <Line type="monotone" dataKey="count" stroke="#1f2a60" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Users by Role Pie */}
        <Card title="Users by Role">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={roles.map((r) => ({ name: r.role, value: r.count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={90}
                label
              >
                {roles.map((_, i) => (
                  <Cell key={`role-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Approvals Snapshot */}
        <Card title="Approvals Snapshot">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={approvals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" stackId="a" fill="#f97316" />
              <Bar dataKey="approved" stackId="a" fill="#22c55e" />
              <Bar dataKey="rejected" stackId="a" fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Needs Attention quick panel */}
        <Card title="Needs Attention">
          <div className="space-y-3">
            {needsAttention.map((x, i) => (
              <button
                key={`${x.label}-${i}`}
                onClick={x.onClick}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border rounded-lg px-4 py-3 text-left"
              >
                <span className="font-medium text-gray-700">{x.label}</span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${x.value > 0 ? "bg-rose-100 text-rose-700" : "bg-green-100 text-green-700"
                    }`}
                >
                  {x.value}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Latest Users */}
      <Card title="Latest Signups">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Joined</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers?.length ? (
                latestUsers.slice(0, 10).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 border font-medium">{u.name}</td>
                    <td className="p-3 border">{u.email}</td>
                    <td className="p-3 border">{u.role}</td>
                    <td className="p-3 border">{u.joinedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={4}>
                    No recent signups.
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
      <h2 className="text-2xl font-bold" style={{ color }}>{value}</h2>
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
