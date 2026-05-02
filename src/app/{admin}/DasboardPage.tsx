import React from 'react'
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
  ResponsiveContainer,
} from "recharts";
import { Activity, AlertTriangle, CheckCircle, Coins, Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import {
  adminCardPadded,
  adminPageTitle, adminPageSubtitle, adminSectionHeading,
  ADMIN_ACCENT, ADMIN_ACCENT_2, ADMIN_SUCCESS, ADMIN_WARNING, ADMIN_DANGER,
  LAYER_2, BORDER,
} from './adminTheme';
import { useGetDashboardStatsQuery } from '@/store/queries/dashboard';
import { Spinner } from '@heroui/react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
      style={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <p className="text-white/50 mb-0.5">{label}</p>
      <p>{payload[0].value?.toLocaleString()}</p>
    </div>
  );
};

const PIE_COLORS = [ADMIN_SUCCESS, "#F59E0B", ADMIN_DANGER, "#3B5BFF", "#9B3BFF", "#6B7280"];

export default function DasboardPage() {
  const { data: statsResponse, isLoading } = useGetDashboardStatsQuery();
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" color="warning" />
        <p className="text-white/50 font-black italic uppercase tracking-widest text-sm animate-pulse">
          Loading Metrics...
        </p>
      </div>
    );
  }

  if (!stats) return (
    <div className="flex items-center justify-center min-h-[400px] text-white/20 font-bold uppercase italic tracking-tighter">
      Failed to load dashboard statistics
    </div>
  );

  const kpiData = [
    {
      title: "Total Users",
      value: stats.summary.totalUsers.toLocaleString(),
      delta: `${stats.summary.userGrowthPercentage >= 0 ? "+" : ""}${stats.summary.userGrowthPercentage}% this month`,
      icon: Users,
      grad: ["#3B5BFF", "#6B3BFF"],
    },
    {
      title: "Active Contests",
      value: stats.summary.activeContests.toLocaleString(),
      delta: "Currently running",
      icon: Trophy,
      grad: ["#9B3BFF", "#DB2777"],
    },
    {
      title: "Monthly Revenue",
      value: `${stats.summary.monthlyRevenue.toLocaleString()} VND`,
      delta: `${stats.summary.revenueGrowthPercentage >= 0 ? "+" : ""}${stats.summary.revenueGrowthPercentage}% vs last month`,
      icon: Coins,
      grad: ["#10B981", "#0EA5E9"],
    },
    {
      title: "Submissions Today",
      value: stats.summary.submissionsToday.toLocaleString(),
      delta: "Real-time updates",
      icon: Activity,
      grad: ["#F59E0B", "#EF4444"],
    },
  ];

  const userGrowthData = stats.userGrowth.map(item => ({
    month: item.label,
    users: item.value
  }));

  const revenueData = stats.revenueByPackage.map(item => ({
    name: item.packageName,
    value: item.revenue
  }));

  const submissionStats = [
    { name: "Accepted", value: stats.submissionStats.accepted },
    { name: "Wrong Answer", value: stats.submissionStats.wrongAnswer },
    { name: "TLE", value: stats.submissionStats.timeLimitExceeded },
    { name: "Compile Error", value: stats.submissionStats.compileError },
    { name: "Runtime Error", value: stats.submissionStats.runtimeError },
    { name: "Others", value: stats.submissionStats.others },
  ].filter(s => s.value > 0);

  const totalSubmissions = submissionStats.reduce((acc, curr) => acc + curr.value, 0);
  const submissionRatio = submissionStats.map(s => ({
    ...s,
    percentage: totalSubmissions > 0 ? Math.round((s.value / totalSubmissions) * 100) : 0
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "60ms" }}>
        <h1 className={adminPageTitle}>Dashboard</h1>
        <p className={adminPageSubtitle}>System overview & live metrics</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiData.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-2xl p-6 border opacity-0 animate-fade-in-up`}
              style={{ animationFillMode: "both", animationDelay: `${i * 60 + 100}ms`, background: LAYER_2, borderColor: BORDER }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={adminSectionHeading}>{item.title}</p>
                  <p className="text-2xl font-black text-white mt-1">{item.value}</p>
                  <p className="text-[11px] text-white/30 font-medium mt-1.5 flex items-center gap-1">
                    <TrendingUp size={10} />
                    {item.delta}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${item.grad[0]}, ${item.grad[1]})`, boxShadow: `0 6px 20px ${item.grad[0]}30` }}
                >
                  <Icon size={18} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          className={`rounded-2xl border xl:col-span-2 p-6 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "320ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>User Growth</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowthData}>
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="users" stroke={ADMIN_ACCENT} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`rounded-2xl border p-6 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "380ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>Revenue by Package</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={28}>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={ADMIN_ACCENT_2} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          className={`rounded-2xl border p-6 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "440ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>Submission Results</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={submissionRatio} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {submissionRatio.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {submissionRatio.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-white/50">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-2xl border p-6 xl:col-span-2 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "500ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>System Alerts</p>
          <div className="flex flex-col gap-3">
            {stats.alerts.map((alert, index) => (
              <AlertRow
                key={index}
                title={alert.message}
                desc={alert.detail}
                level={alert.type === "info" ? "success" : alert.type === "error" ? "danger" : alert.type as any}
              />
            ))}
            {stats.alerts.length === 0 && (
              <p className="text-center text-white/20 py-10 font-bold italic uppercase tracking-widest text-xs border-2 border-dashed border-white/5 rounded-2xl">
                No active system alerts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ title, desc, level }: { title: string; desc: string; level: "success" | "warning" | "danger" }) {
  const cfg = {
    success: { color: ADMIN_SUCCESS, bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)", Icon: CheckCircle },
    warning: { color: ADMIN_WARNING, bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)", Icon: AlertTriangle },
    danger: { color: ADMIN_DANGER, bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)", Icon: Zap },
  }[level];

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl border"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <cfg.Icon size={16} style={{ color: cfg.color }} className="shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
