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
  AreaChart,
  Area,
} from "recharts";
import { ClassReport } from "./Dashboard/ClassReport";

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

const contestSubmissionRatio = [
  { name: "Accepted", value: 45 },
  { name: "Failed (WA/TLE)", value: 40 },
  { name: "Compile Error", value: 15 },
];

const failedProblems = [
  { id: "P102", name: "Dynamic Connectivity", failedCount: 1240 },
  { id: "P045", name: "Shortest Path Matrix", failedCount: 980 },
  { id: "P301", name: "Knapsack Variations", failedCount: 850 },
  { id: "P512", name: "Maximum Flow (Dinic)", failedCount: 720 },
  { id: "P203", name: "Segment Tree Lazy", failedCount: 640 },
  { id: "P118", name: "Fast Fourier Transform", failedCount: 512 },
];

const personalStatusData = {
  activeUsers: "3,450",
  avgSolveTime: "45 mins",
  completionRate: "68%",
};

const submissionHistory = [
  { day: "Mon", submissions: 850 },
  { day: "Tue", submissions: 1200 },
  { day: "Wed", submissions: 900 },
  { day: "Thu", submissions: 1500 },
  { day: "Fri", submissions: 2100 },
  { day: "Sat", submissions: 3200 },
  { day: "Sun", submissions: 2800 },
];

const PIE_COLORS = ["#22d3ee", "#f43f5e", "#a855f7"];
const CONTEST_PIE_COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

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
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color}
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* PIE */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-emerald-500">
            Overall Submission Ratio
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

        {/* CONTEST PIE */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-amber-500">
            Contest Pass/Fail Ratio
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={contestSubmissionRatio}
                dataKey="value"
                innerRadius={40}
                outerRadius={90}
                paddingAngle={4}
              >
                {contestSubmissionRatio.map((_, i) => (
                  <Cell key={i} fill={CONTEST_PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* PERSONAL STATUS */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10 flex flex-col justify-center">
          <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-blue-500">
            Personal Status (Avg)
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
              <span className="text-sm text-slate-500 font-medium">Active Users Today</span>
              <span className="text-xl font-bold text-slate-800 dark:text-white">{personalStatusData.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
              <span className="text-sm text-slate-500 font-medium">Avg Solve Time</span>
              <span className="text-xl font-bold text-emerald-500">{personalStatusData.avgSolveTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Completion Rate</span>
              <span className="text-xl font-bold text-fuchsia-500">{personalStatusData.completionRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MORE CHARTS: SUBMISSION HISTORY & ALERTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* SUBMISSION HISTORY */}
        <div className="xl:col-span-2 rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-orange-500">
            Submission History (This Week)
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={submissionHistory}>
              <defs>
                <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="submissions" stroke="#f97316" fillOpacity={1} fill="url(#colorSub)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* FAILED PROBLEMS */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10">
          <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-red-500">
            Top Failed Problems
          </h3>

          <div className="space-y-4">
            {failedProblems.map((fp) => (
              <div key={fp.id} className="flex flex-col gap-1 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{fp.id} - {fp.name}</span>
                  <span className="text-xs font-black text-red-500 bg-red-100 dark:bg-red-500/20 px-2 py-1 rounded-md">
                    {fp.failedCount} fails
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-black uppercase tracking-widest text-xs mt-8 mb-4 text-purple-500">
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
          </div>
        </div>
      </div>

      {/* CLASS PERFORMANCE REPORT */}
      <ClassReport />
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
