"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Tabs,
  Tab,
} from "@heroui/react";
import { Flame, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8">

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="space-y-8">

          {/* Profile */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <CardBody className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <Avatar
                  src="/your-avatar.jpg"
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-lg font-semibold">Đăng Hải</p>
                  <p className="text-sm text-default-500">
                    yMXnO...FM0Ozd
                  </p>
                  <p className="text-sm text-default-500 mt-1">
                    Rank ~5,000,000
                  </p>
                </div>
              </div>

              <Button
                size="md"
                color="success"
                className="w-full font-medium"
                startContent={<Edit size={16} />}
                onClick={()=>{router.push("/Settings")}}
              >
                Edit Profile
              </Button>
            </CardBody>
          </Card>

          {/* Community Stats */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <CardHeader className="text-base font-semibold px-6 pt-6">
              Community Stats
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-4 text-sm">
              {[
                ["Views", 0],
                ["Solution", 0],
                ["Discuss", 0],
                ["Reputation", 0],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between text-default-500"
                >
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Languages */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <CardHeader className="text-base font-semibold px-6 pt-6">
              Languages
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Java</span>
                <span className="text-default-500">6 solved</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span>JavaScript</span>
                <span className="text-default-500">2 solved</span>
              </div>
            </CardBody>
          </Card>

          {/* Skills */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <CardHeader className="text-base font-semibold px-6 pt-6">
              Skills
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Advanced</p>
                <Chip size="md" variant="flat">
                  Dynamic Programming ×1
                </Chip>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Intermediate</p>
                <div className="flex flex-wrap gap-2">
                  <Chip size="md" variant="flat">Hash Table ×3</Chip>
                  <Chip size="md" variant="flat">Math ×3</Chip>
                  <Chip size="md" variant="flat">Recursion ×1</Chip>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Fundamental</p>
                <div className="flex flex-wrap gap-2">
                  <Chip size="md" variant="flat">String ×3</Chip>
                  <Chip size="md" variant="flat">Array ×2</Chip>
                  <Chip size="md" variant="flat">Two Pointers ×2</Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="space-y-8">

          {/* Solved + Difficulty */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <CardBody className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

              {/* Donut */}
              <div className="flex justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-divider flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold">7</p>
                    <p className="text-sm text-default-500">
                      /3808 Solved
                    </p>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-success">Easy</span>
                  <span>4 / 922</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning">Med</span>
                  <span>3 / 1986</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-danger">Hard</span>
                  <span>0 / 900</span>
                </div>
              </div>

              {/* Badges */}
              <div>
                <p className="text-base font-semibold mb-2">
                  Badges
                </p>
                <p className="text-default-500 text-base">0</p>
                <Divider className="my-3" />
                <p className="text-sm text-default-500">
                  Locked Badge
                </p>
                <p className="text-base">
                  Jan LeetCoding Challenge
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Heatmap */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <CardHeader className="flex justify-between items-center px-8 pt-8">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-warning" />
                <span className="text-lg font-semibold">
                  226 submissions in the past one year
                </span>
              </div>
              <span className="text-sm text-default-500">
                Total active days: 5 · Max streak: 3
              </span>
            </CardHeader>
            <CardBody className="px-8 pb-8">
              <div className="grid grid-cols-53 gap-1.5">
         {Array.from({ length: 365 }).map((_, i) => {
  // deterministic "random" – same value every render, server & client
  const pseudo = (i * 9301 + 49297) % 233280 / 233280; // linear congruential generator lite
  // or even simpler: use i % something
  // const pseudo = (i * 17 + 31) % 100 / 100;

  let bg = "bg-default-100";
  if (pseudo > 0.85) bg = "bg-success";
  else if (pseudo > 0.55) bg = "bg-success-400";
  else if (pseudo > 0.20) bg = "bg-success-200";

  return <div key={i} className={`w-3 h-3 rounded-sm ${bg}`} />;
})}
              </div>
            </CardBody>
          </Card>

          {/* Recent */}
          <Card className="bg-content1 border border-divider rounded-2xl">
            <Tabs
              variant="underlined"
              color="success"
              classNames={{ tabList: "px-8 pt-6" }}
            >
              <Tab key="recent" title="Recent AC">
                <div className="px-8 pb-8 divide-y divide-divider">
                  {[
                    ["Longest Palindromic Substring", "19 days ago"],
                    ["Longest Substring Without Repeating Characters", "19 days ago"],
                    ["Roman to Integer", "4 months ago"],
                    ["Remove Duplicates from Sorted Array", "4 months ago"],
                    ["Two Sum", "7 months ago"],
                  ].map(([title, time]) => (
                    <div
                      key={title}
                      className="py-4 flex justify-between items-center"
                    >
                      <span className="text-base">{title}</span>
                      <span className="text-sm text-default-500">
                        {time}
                      </span>
                    </div>
                  ))}
                  <p className="text-center text-success mt-6 cursor-pointer">
                    View all submissions →
                  </p>
                </div>
              </Tab>
              <Tab key="list" title="List" />
              <Tab key="solutions" title="Solutions" />
              <Tab key="discuss" title="Discuss" />
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
