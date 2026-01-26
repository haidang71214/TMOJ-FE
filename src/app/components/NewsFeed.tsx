"use client";
import React from "react";
import { Megaphone } from "lucide-react";

interface NewsFeedProps {
  announcements?: string[];
  brandNavy?: string;
  brandOrange?: string;
}

export default function NewsFeed({
  announcements = [
    "SU26 Enrollment for 'Data Structures' is now open.",
    "System maintenance scheduled for January 25th, 02:00 AM UTC.",
    "Congratulations to FPTU team for winning the ICPC Regional Asia!",
    "New Feature: Grade analytics dashboard is now live.",
  ],
  brandNavy = "#071739",
  brandOrange = "#FF5C00",
}: NewsFeedProps) {
  return (
    <>
      <div
        style={{ backgroundColor: brandNavy }}
        className="w-full text-white py-2.5 px-6 flex items-center gap-4 overflow-hidden shrink-0 z-30 shadow-md"
      >
        <div
          style={{ color: brandOrange }}
          className="flex items-center gap-2 z-10 pr-4 shrink-0 font-black text-[10px] uppercase tracking-tighter italic"
        >
          <Megaphone size={16} /> News Feed:
        </div>
        <div className="relative flex overflow-hidden w-full h-5 items-center font-bold italic text-[11px]">
          <div className="marquee-content flex items-center gap-20 absolute">
            {announcements.concat(announcements).map((text, i) => (
              <span
                key={i}
                className="whitespace-nowrap flex items-center gap-3"
              >
                <span style={{ color: brandOrange }} className="opacity-60">
                  /
                </span>{" "}
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx font-family="sans-serif">{`
        .marquee-content {
          display: flex;
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}