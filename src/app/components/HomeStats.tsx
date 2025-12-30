import { Card, CardBody } from "@heroui/react";
import { Flame, Trophy, Calendar as CalendarIcon } from "lucide-react";

export const HomeStats = () => {
  const stats = [
    {
      label: "Streak",
      value: "12 Days",
      icon: Flame,
      color: "bg-[#E3C39D]",
      iconColor: "text-[#A68868]",
    },
    {
      label: "Solved",
      value: "145 Probs",
      icon: Trophy,
      color: "bg-[#CDD5DB]",
      iconColor: "text-[#4B6382]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="bg-white border-none rounded-[24px] shadow-sm"
        >
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className={`p-3 ${s.color} rounded-xl ${s.iconColor}`}>
              <s.icon
                size={24}
                fill={s.label === "Streak" ? "currentColor" : "none"}
              />
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#A4B5C4] uppercase">
                {s.label}
              </p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </CardBody>
        </Card>
      ))}
      <Card className="bg-[#071739] text-white rounded-[24px] shadow-lg">
        <CardBody className="flex flex-row items-center gap-4 p-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#A4B5C4] uppercase">
              Today
            </p>
            <p className="text-lg font-bold">Dec 30, 2025</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
