/**
 * Admin Design System — shared constants for all {admin} pages.
 * Import these instead of hardcoding colors/classNames directly.
 */

// ── Page wrapper ─────────────────────────────────────────────────────────────
export const adminPage = "min-h-full p-6 md:p-8 space-y-8 text-white";

// ── Cards / panels ───────────────────────────────────────────────────────────
export const adminCard =
  "rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm";

export const adminCardPadded =
  "rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-6";

// ── Page header ──────────────────────────────────────────────────────────────
export const adminPageTitle = "text-3xl font-black tracking-tight text-white";
export const adminPageSubtitle = "text-xs font-semibold uppercase tracking-widest text-white/35 mt-1";

// ── Section headings ─────────────────────────────────────────────────────────
export const adminSectionHeading =
  "text-[10px] font-black uppercase tracking-[0.15em] text-white/30 mb-3";

// ── Table ────────────────────────────────────────────────────────────────────
export const adminTableWrapper =
  "rounded-2xl border border-white/[0.07] overflow-hidden";

// ── Accent colors (use in style={{ color: ... }}) ────────────────────────────
export const ADMIN_ACCENT = "#3B5BFF";
export const ADMIN_ACCENT_2 = "#9B3BFF";
export const ADMIN_SUCCESS = "#10B981";
export const ADMIN_WARNING = "#F59E0B";
export const ADMIN_DANGER = "#EF4444";

// ── 4-level dark layer system ────────────────────────────────────────────────
export const LAYER_0 = "#06090F"; // topbar, sidebar — darkest chrome
export const LAYER_1 = "#0E1420"; // page / content background
export const LAYER_2 = "#162035"; // card surface
export const LAYER_3 = "#1E2B42"; // elevated: table header, input bg
export const BORDER  = "rgba(255,255,255,0.10)"; // stronger border
export const BORDER_FAINT = "rgba(255,255,255,0.06)"; // row dividers

// Legacy aliases kept for backward compat
export const ADMIN_BG      = LAYER_1;
export const ADMIN_SURFACE = LAYER_2;
export const ADMIN_BORDER  = BORDER;

// ── Difficulty badge inline styles ───────────────────────────────────────────
export const difficultyStyle = (difficulty: string | undefined) => {
  if (difficulty === "easy")
    return { color: "#10B981", background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.2)" };
  if (difficulty === "medium")
    return { color: "#F59E0B", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.2)" };
  if (difficulty === "hard")
    return { color: "#EF4444", background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.2)" };
  return { color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" };
};

// ── Status badge inline styles ───────────────────────────────────────────────
export const statusStyle = (status: string | undefined) => {
  if (status === "published")
    return { color: "#10B981", background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.2)" };
  if (status === "draft")
    return { color: "#F59E0B", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.2)" };
  return { color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" };
};

// ── Action button (icon-only) styles ─────────────────────────────────────────
export const iconBtnBase =
  "w-7 h-7 inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95";

export const iconBtnGhost =
  `${iconBtnBase} text-white/40 hover:text-white/80 hover:bg-white/[0.07]`;

export const iconBtnDanger =
  `${iconBtnBase} text-red-400/60 hover:text-red-400 hover:bg-red-400/10`;

export const iconBtnSuccess =
  `${iconBtnBase} text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10`;

// ── Primary CTA button ───────────────────────────────────────────────────────
export const adminPrimaryBtn = {
  className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95",
  style: {
    background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)",
    boxShadow: "0 4px 16px rgba(59,91,255,0.3)",
  },
};

export const adminGhostBtn = {
  className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95",
  style: {
    color: "rgba(255,255,255,0.5)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};
