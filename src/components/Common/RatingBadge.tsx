"use client";

import React from "react";

const RATING_TIERS: { min: number; title: string; className: string; color: string }[] = [
  { min: 2900, title: "Legendary Grandmaster", className: "rate-legendary-grandmaster", color: "#a30000" },
  { min: 2600, title: "International Grandmaster", className: "rate-international-grandmaster", color: "#ff0000" },
  { min: 2400, title: "Grandmaster", className: "rate-grandmaster", color: "#ff3030" },
  { min: 2300, title: "International Master", className: "rate-international-master", color: "#ff8c00" },
  { min: 2200, title: "Master", className: "rate-master", color: "#ffcc00" },
  { min: 1900, title: "Candidate Master", className: "rate-candidate-master", color: "#aa00aa" },
  { min: 1600, title: "Expert", className: "rate-expert", color: "#0000ff" },
  { min: 1400, title: "Specialist", className: "rate-specialist", color: "#03a89e" },
  { min: 1200, title: "Pupil", className: "rate-pupil", color: "#008000" },
  { min: 0,    title: "Newbie", className: "rate-newbie", color: "#808080" },
];

export function getRatingTier(rating: number) {
  return RATING_TIERS.find((t) => rating >= t.min) ?? RATING_TIERS[RATING_TIERS.length - 1];
}

interface Props {
  rating: number;
  showTitle?: boolean;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function RatingBadge({
  rating,
  showTitle = true,
  showNumber = true,
  size = "md",
  className = "",
}: Props) {
  const tier = getRatingTier(rating);

  const sizeCls =
    size === "sm" ? "text-[10px] px-2 py-0.5 gap-1" :
    size === "lg" ? "text-sm   px-3 py-1.5 gap-2" :
                    "text-xs   px-2.5 py-1   gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-black italic uppercase tracking-wide rounded-full ${sizeCls} ${className}`}
      style={{
        color: tier.color,
        backgroundColor: `${tier.color}1a`,
        border: `1px solid ${tier.color}55`,
      }}
      title={`${tier.title} (${rating})`}
    >
      {showNumber && <span>{rating}</span>}
      {showTitle && <span className="hidden sm:inline">{tier.title}</span>}
    </span>
  );
}
