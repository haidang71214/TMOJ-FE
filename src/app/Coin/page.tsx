"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Chip,
} from "@heroui/react";
import {
  Coins,
  Flame,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* ===== MOCK DATA ===== */
const wallet = {
  coins: 1250,
  level: 7,
  exp: 320,
  expNext: 500,
  currentStreak: 5,
  longestStreak: 14,
};

const transactions = [
  {
    id: 1,
    amount: +50,
    reason: "Solved Problem: Two Sum",
    time: "2026-01-24 20:10",
  },
  {
    id: 2,
    amount: -300,
    reason: "Bought Study Package: Array Mastery",
    time: "2026-01-23 09:32",
  },
  {
    id: 3,
    amount: +100,
    reason: "Contest Top 10 Reward",
    time: "2026-01-22 18:00",
  },
];

export default function CoinPage() {
  return (
    <div className="mx-auto p-8 space-y-10">
      {/* ===== HEADER ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coins */}
        <Card shadow="sm" className="rounded-3xl">
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3">
              <Coins className="text-[#FFB800]" />
              <span className="font-black text-lg">Coins</span>
            </div>
            <div className="text-4xl font-black">{wallet.coins}</div>
          </CardBody>
        </Card>

        {/* Streak */}
        <Card shadow="sm" className="rounded-3xl">
          <CardBody className="space-y-2">
            <div className="flex items-center gap-3">
              <Flame className="text-orange-500" />
              <span className="font-black text-lg">Streak</span>
            </div>

            <div className="text-xl font-bold">
              {wallet.currentStreak} days
            </div>

            <Chip size="sm" variant="flat" color="warning">
              Longest: {wallet.longestStreak} days
            </Chip>
          </CardBody>
        </Card>

        {/* Level */}
        <Card shadow="sm" className="rounded-3xl">
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3">
              <Trophy className="text-purple-500" />
              <span className="font-black text-lg">Level</span>
            </div>

            <div className="text-xl font-bold">Level {wallet.level}</div>

            <Progress
              value={(wallet.exp / wallet.expNext) * 100}
              color="warning"
              size="sm"
              radius="full"
            />

            <div className="text-xs text-default-500">
              {wallet.exp} / {wallet.expNext} EXP
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="flex flex-wrap gap-4">
        <Button
          color="warning"
          radius="full"
          className="font-black"
        >
          🔥 Claim Daily Streak
        </Button>

        <Button variant="bordered" radius="full" className="font-black">
          🧠 Solve Problems
        </Button>

        <Button variant="bordered" radius="full" className="font-black">
          🏆 Join Contest
        </Button>

        <Button variant="bordered" radius="full" className="font-black">
          🛒 Coin Shop
        </Button>
      </div>

      {/* ===== TRANSACTION HISTORY ===== */}
      <Card shadow="sm" className="rounded-3xl">
        <CardHeader>
          <h2 className="font-black text-xl">Coin History</h2>
        </CardHeader>

        <CardBody className="space-y-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 rounded-xl
                         bg-default-100 dark:bg-[#1C2737]"
            >
              <div>
                <div className="font-bold">{t.reason}</div>
                <div className="text-xs text-default-500">{t.time}</div>
              </div>

              <div
                className={`flex items-center gap-1 font-black text-lg ${
                  t.amount > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {t.amount > 0 ? (
                  <ArrowUpRight size={18} />
                ) : (
                  <ArrowDownRight size={18} />
                )}
                {t.amount}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
