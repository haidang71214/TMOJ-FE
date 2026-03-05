"use client";
import { Users, Trophy, Coins, AlertTriangle, Activity } from "lucide-react";
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

const kpi = [
  {
    title: "Total Users",
    value: "12,480",
    icon: Users,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Active Contests",
    value: "6",
    icon: Trophy,
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Monthly Revenue",
    value: "$8,420",
    icon: Coins,
    color: "from-emerald-400 to-green-500",
  },
  {
    title: "Submission Rate",
    value: "1,248 / day",
    icon: Activity,
    color: "from-indigo-400 to-purple-500",
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
  { name: "Package A", value: 4200 },
  { name: "Package B", value: 3100 },
  { name: "Coin Packs", value: 1120 },
];

const submissionRatio = [
  { name: "Accepted", value: 62 },
  { name: "Compile Error", value: 25 },
  { name: "Runtime Error", value: 13 },
];

const PIE_COLORS = ["#22d3ee", "#f43f5e", "#a855f7"];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpi.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="
                rounded-2xl p-6
                bg-white border border-slate-200 shadow-sm
                dark:bg-black/40 dark:border-white/10 dark:backdrop-blur-xl
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400">
                    {item.title}
                  </p>
                  <p className="text-3xl font-black mt-2 text-slate-800 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color}
                    flex items-center justify-center text-black`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* USER GROWTH */}
        <div className="xl:col-span-2 rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-indigo-600 dark:text-cyan-400">
            User Growth
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* REVENUE */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-fuchsia-500">
            Revenue by Package
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SUBMISSION + ALERTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* PIE */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-emerald-500">
            Submission Result Ratio
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={submissionRatio}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {submissionRatio.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SYSTEM ALERTS */}
        <div className="xl:col-span-2 rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-red-500">
            System Alerts
          </h3>

          <div className="space-y-4">
            <AlertItem
              title="Live Contest: Winter Challenge 2026"
              desc="1,248 submissions in last 10 minutes"
              level="warning"
            />
            <AlertItem
              title="Payment Gateway Delay"
              desc="Some coin transactions are pending"
              level="danger"
            />
            <AlertItem
              title="New Badge System Enabled"
              desc="Gamification module activated"
              level="success"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({
  title,
  desc,
  level,
}: {
  title: string;
  desc: string;
  level: "success" | "warning" | "danger";
}) {
  const color =
    level === "success"
      ? "text-emerald-400"
      : level === "warning"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="flex items-start gap-4">
      <AlertTriangle className={color} size={20} />
      <div>
        <p className="font-bold text-slate-800 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
