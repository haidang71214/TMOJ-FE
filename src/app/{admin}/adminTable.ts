/**
 * AdminTable — drop-in wrapper that applies the dark admin table style.
 * Usage:
 *   <AdminTable>
 *     <table>...</table>   (native) or any children
 *   </AdminTable>
 *
 * For native <table> usage use adminTh / adminTd className helpers below.
 */
export const ADMIN_TABLE_WRAPPER: React.CSSProperties = {
  background: "#162035",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "1rem",
  overflow: "hidden",
};

export const ADMIN_TH =
  "px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/[0.08]";

export const ADMIN_TH_RIGHT =
  "px-4 py-3 text-right text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/[0.08]";

export const ADMIN_TD = "px-4 py-3 text-[13px] text-white/70 border-b border-white/[0.05]";

export const ADMIN_TD_MUTED = "px-4 py-3 text-[13px] text-white/35 border-b border-white/[0.05]";

export const ADMIN_TR_HOVER = "hover:bg-white/[0.03] transition-colors last:border-none";

export const ADMIN_THEAD_BG = "bg-[#1E2B42]";

// Page header helpers
export const ADMIN_H1 = "text-3xl font-black tracking-tight text-white";
export const ADMIN_SUBTITLE = "text-xs font-semibold uppercase tracking-widest text-white/35 mt-1";
export const ADMIN_PAGE_WRAPPER = "min-h-full p-6 md:p-8 space-y-8 text-white";

// Input search bar style for admin
export const adminInputClass = {
  inputWrapper:
    "bg-[#1E2B42] border border-white/10 rounded-xl h-9 hover:border-white/20 focus-within:!border-[#3B5BFF]",
  input: "text-white/80 text-sm placeholder:text-white/25",
};
