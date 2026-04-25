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
  adminPage, adminCardPadded,
  adminPageTitle, adminPageSubtitle, adminSectionHeading,
  ADMIN_ACCENT, ADMIN_ACCENT_2, ADMIN_SUCCESS, ADMIN_WARNING, ADMIN_DANGER,
  LAYER_2, LAYER_3, BORDER,
} from './adminTheme';

const kpi = [
  {
    title: "Total Users",
    value: "12,480",
    delta: "+8.2% this month",
    icon: Users,
    grad: ["#3B5BFF", "#6B3BFF"],
  },
  {
    title: "Active Contests",
    value: "6",
    delta: "2 ending today",
    icon: Trophy,
    grad: ["#9B3BFF", "#DB2777"],
  },
  {
    title: "Monthly Revenue",
    value: "$8,420",
    delta: "+12% vs last month",
    icon: Coins,
    grad: ["#10B981", "#0EA5E9"],
  },
  {
    title: "Submissions / Day",
    value: "1,248",
    delta: "+340 vs yesterday",
    icon: Activity,
    grad: ["#F59E0B", "#EF4444"],
  },
];

const userGrowth = [
  { month: "Aug", users: 6200 },
  { month: "Sep", users: 7100 },
  { month: "Oct", users: 8600 },
  { month: "Nov", users: 9800 },
  { month: "Dec", users: 11200 },
  { month: "Jan", users: 12480 },
];

const revenueData = [
  { name: "Pkg A", value: 4200 },
  { name: "Pkg B", value: 3100 },
  { name: "Coins", value: 1120 },
];

const submissionRatio = [
  { name: "Accepted", value: 62 },
  { name: "Compile Error", value: 25 },
  { name: "Runtime Error", value: 13 },
];

const PIE_COLORS = [ADMIN_SUCCESS, ADMIN_WARNING, ADMIN_DANGER];

const ALERTS = [
  { title: "Live Contest: Winter Challenge 2026", desc: "1,248 submissions in last 10 minutes", level: "warning" as const },
  { title: "Payment Gateway Delay", desc: "Some coin transactions are pending", level: "danger" as const },
  { title: "New Badge System Enabled", desc: "Gamification module activated", level: "success" as const },
];

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

export default function DasboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "60ms" }}>
        <h1 className={adminPageTitle}>Dashboard</h1>
        <p className={adminPageSubtitle}>System overview & live metrics</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpi.map((item, i) => {
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
        {/* User growth — spans 2 cols */}
        <div
          className={`rounded-2xl border xl:col-span-2 p-6 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "320ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>User Growth</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="users" stroke={ADMIN_ACCENT} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by package */}
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
        {/* Pie — submission ratio */}
        <div
          className={`rounded-2xl border p-6 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "440ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>Submission Results</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={submissionRatio} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {submissionRatio.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-col gap-1.5 mt-2">
            {submissionRatio.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-white/50">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* System alerts */}
        <div
          className={`rounded-2xl border p-6 xl:col-span-2 opacity-0 animate-fade-in-up`}
          style={{ animationFillMode: "both", animationDelay: "500ms", background: LAYER_2, borderColor: BORDER }}
        >
          <p className={adminSectionHeading}>System Alerts</p>
          <div className="flex flex-col gap-3">
            {ALERTS.map((alert) => (
              <AlertRow key={alert.title} {...alert} />
            ))}
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
    danger:  { color: ADMIN_DANGER,  bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.15)",  Icon: Zap },
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
