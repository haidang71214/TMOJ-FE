"use client";

import { Card, CardBody, Spinner } from "@heroui/react";
import { TrendingUp, Trophy } from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetUserRatingHistoryQuery } from "@/store/queries/ranking";
import { getRatingTier } from "./RatingBadge";

interface Props {
  userId: string;
  className?: string;
}

const TIER_LINES = [
  { value: 1200, color: "#008000" },
  { value: 1400, color: "#03a89e" },
  { value: 1600, color: "#0000ff" },
  { value: 1900, color: "#aa00aa" },
  { value: 2200, color: "#ffcc00" },
  { value: 2400, color: "#ff3030" },
];

export default function RatingHistoryChart({ userId, className = "" }: Props) {
  const { data, isLoading } = useGetUserRatingHistoryQuery(userId, { skip: !userId });

  const rows = data?.data ?? [];

  const chartData = useMemo(
    () =>
      rows.map((r, i) => ({
        idx: i + 1,
        rating: r.newRating,
        change: r.ratingChange,
        rank: r.rankInContest,
        date: r.processedAt ? new Date(r.processedAt).toLocaleDateString() : "",
      })),
    [rows]
  );

  const current = rows.length ? rows[rows.length - 1] : null;
  const max = rows.length ? Math.max(...rows.map((r) => r.newRating)) : 0;
  const min = rows.length ? Math.min(...rows.map((r) => r.newRating)) : 0;
  const tier = current ? getRatingTier(current.newRating) : null;

  return (
    <Card className={`bg-white dark:bg-[#1C2737] rounded-[2rem] border-none shadow-lg ${className}`}>
      <CardBody className="p-6 gap-4">
        <div className="flex items-center justify-between border-b border-divider pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#FF5C00]" />
            <h3 className="font-[1000] uppercase italic text-sm">Rating History</h3>
          </div>
          {current && tier && (
            <div className="flex items-center gap-3 text-xs font-bold">
              <span style={{ color: tier.color }} className="font-[1000] italic text-base">
                {current.newRating}
              </span>
              <span className="text-slate-400">Max {max}</span>
              <span className="text-slate-400">Min {min}</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="md" color="warning" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <Trophy size={32} className="opacity-30" />
            <p className="text-xs font-bold italic uppercase">Chưa tham gia contest nào được rated</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="idx" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis
                  domain={["dataMin - 100", "dataMax + 100"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#071739",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                  formatter={((value: any, name: any, props: any) => {
                    if (name === "rating") {
                      const change = props?.payload?.change ?? 0;
                      const sign = change >= 0 ? "+" : "";
                      return [`${value} (${sign}${change})`, "Rating"];
                    }
                    return [value, name ?? ""];
                  }) as any}
                  labelFormatter={(label, payload: any) => payload?.[0]?.payload?.date ?? ""}
                />
                {TIER_LINES.map((t) => (
                  <ReferenceLine
                    key={t.value}
                    y={t.value}
                    stroke={t.color}
                    strokeOpacity={0.2}
                    strokeDasharray="3 3"
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#FF5C00"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FF5C00" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
